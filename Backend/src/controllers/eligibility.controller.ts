const Scheme = require("../models/Scheme.model");

exports.checkEligibility = async (req: any, res: any) => {
  try {
    const {
      dateOfBirth,
      gender,
      caste,
      annualIncome,
      education,
      state,
    } = req.body;

    // 🔹 Calculate Age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    const schemes = await Scheme.find({
      state: state,

      $and: [
        {
          $or: [
            { "eligibility.gender": "All" },
            { "eligibility.gender": gender },
          ],
        },
        {
          "eligibility.minAge": { $lte: age },
        },
        {
          "eligibility.maxAge": { $gte: age },
        },
        {
          $or: [
            { "eligibility.caste": { $size: 0 } },
            { "eligibility.caste": { $in: [caste] } },
          ],
        },
        {
          $or: [
            { "eligibility.income": 0 },
            { "eligibility.income": { $gte: annualIncome } },
          ],
        },
        {
          $or: [
            { "eligibility.education": "No Minimum Qualification" },
            { "eligibility.education": education },
          ],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    console.error("Eligibility Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
