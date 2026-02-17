const Scheme = require("../models/Scheme.model");

exports.checkEligibility = async (req: any, res: any) => {
  try {
    const {
      dateOfBirth,
      gender,
      maritalStatus,
      caste,
      annualIncome,
      disability,
      education,
      employment,
      state,
    } = req.body;

    const normalize = (v: any) => (v || "").toString().trim().toLowerCase();

    const calculateAge = (dob: string) => {
      const today = new Date();
      const birthDate = new Date(dob);
      if (Number.isNaN(birthDate.getTime())) return null;

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    const educationKeywords: Record<string, string[]> = {
      below10: ["below", "primary", "minimum 8th", "8th", "no minimum", "not required", "any"],
      "10th": ["10th", "class 10", "minimum 10th"],
      "12th": ["12th", "intermediate", "class 12"],
      graduate: ["graduate", "higher education", "college"],
      postgraduate: ["post-graduate", "post graduate", "post graduation", "research"],
      professional: ["professional", "engineering", "polytechnic", "iti", "diploma", "ca"],
    };

    const casteAliases: Record<string, string[]> = {
      general: ["general"],
      obc: ["obc", "bc", "ebc", "sbc"],
      sc: ["sc"],
      st: ["st"],
      ews: ["ews"],
    };

    const matchesEducation = (
      schemeEducationRaw: string,
      userEducation: string,
      userEmployment: string
    ) => {
      const schemeEducation = normalize(schemeEducationRaw);
      if (!schemeEducation || ["all", "any", "not required", "no minimum qualification"].includes(schemeEducation)) {
        return true;
      }
      if (schemeEducation.includes("student") && normalize(userEmployment) === "student") {
        return true;
      }
      const key = normalize(userEducation);
      const keywords = educationKeywords[key] || [key];
      return keywords.some((k) => k && schemeEducation.includes(k));
    };

    const matchesCaste = (schemeCasteRaw: string[], userCaste: string) => {
      if (!Array.isArray(schemeCasteRaw) || schemeCasteRaw.length === 0) return true;
      const normalized = schemeCasteRaw.map((c) => normalize(c));
      if (normalized.includes("all")) return true;
      const aliases = casteAliases[normalize(userCaste)] || [normalize(userCaste)];
      return aliases.some((a) => a && normalized.includes(a));
    };

    const age = dateOfBirth ? calculateAge(dateOfBirth) : null;
    const userIncome = Number(annualIncome || 0);
    const userState = normalize(state);
    const userGender = normalize(gender);
    const userCaste = normalize(caste);
    const userEducation = normalize(education);
    const hasDisability = normalize(disability) === "yes";
    const userEmployment = normalize(employment);

    // Keep these extracted so request contract supports full profile fields.
    void maritalStatus;

    const schemes = await Scheme.find({});

    const eligibleSchemes = schemes.filter((scheme: any) => {
      const elig = scheme.eligibility || {};
      const schemeType = normalize(scheme.type);
      const schemeState = normalize(scheme.state);

      // State schemes are user-state specific. Central schemes are all-India.
      if (schemeType === "state" && userState && schemeState !== userState) {
        return false;
      }

      if (typeof age === "number") {
        const minAge = typeof elig.minAge === "number" ? elig.minAge : 0;
        const maxAge = typeof elig.maxAge === "number" ? elig.maxAge : 200;
        if (age < minAge || age > maxAge) return false;
      }

      const schemeGender = normalize(elig.gender || "all");
      if (
        userGender &&
        schemeGender !== "all" &&
        schemeGender !== userGender &&
        !(schemeGender === "transgender" && userGender === "other")
      ) {
        return false;
      }

      if (userCaste && !matchesCaste(elig.caste || [], userCaste)) {
        return false;
      }

      const schemeIncomeLimit =
        typeof elig.incomeLimit === "number"
          ? elig.incomeLimit
          : (typeof elig.income === "number" ? elig.income : 0);
      if (schemeIncomeLimit > 0 && userIncome > schemeIncomeLimit) {
        return false;
      }

      if (elig.disability === true && !hasDisability) {
        return false;
      }
      if (elig.disabilityPercentage && !hasDisability) {
        return false;
      }

      if (elig.employment) {
        const schemeEmployment = normalize(elig.employment);
        if (userEmployment && schemeEmployment !== "all" && !schemeEmployment.includes(userEmployment)) {
          return false;
        }
      }

      if (userEducation && !matchesEducation(elig.education || "", userEducation, userEmployment)) {
        return false;
      }

      return true;
    });

    return res.status(200).json({
      success: true,
      count: eligibleSchemes.length,
      data: eligibleSchemes,
    });
  } catch (error) {
    console.error("Eligibility Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
