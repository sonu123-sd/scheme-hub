import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import schemes from "@/data/schemes.json";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type SchemeEligibility = {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  caste?: string[];
  income?: number;
  incomeLimit?: number;
  education?: string;
  disability?: boolean;
  disabilityPercentage?: string;
  employment?: string;
};

type SchemeItem = {
  id: string;
  name: string;
  category?: string;
  type?: string;
  state?: string;
  description?: string;
  official_link?: string;
  eligibility?: SchemeEligibility;
  documents_required?: string[];
  apply_steps?: string[];
};

const typedSchemes = schemes as SchemeItem[];

const normalize = (v: string) => (v || "").toLowerCase().trim();
const containsAny = (text: string, words: string[]) => words.some((w) => text.includes(w));

const isGreeting = (text: string) =>
  /^(h+i+|h+e+l+o+|h+e+y+|n+a+m+a+s+t+e+|n+a+m+a+s+k+a+r+)$/i.test(text.trim());

const calculateAge = (dob?: string) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const schemeMatchesProfile = (scheme: SchemeItem, profile: {
  age: number | null;
  gender: string;
  caste: string;
  education: string;
  employment: string;
  state: string;
}) => {
  const elig = scheme.eligibility || {};
  const schemeType = normalize(scheme.type || "");
  const schemeState = normalize(scheme.state || "");

  if (schemeType === "state" && profile.state && schemeState && schemeState !== profile.state) {
    return false;
  }

  if (typeof profile.age === "number") {
    const minAge = typeof elig.minAge === "number" ? elig.minAge : 0;
    const maxAge = typeof elig.maxAge === "number" ? elig.maxAge : 200;
    if (profile.age < minAge || profile.age > maxAge) return false;
  }

  const schemeGender = normalize(elig.gender || "all");
  if (
    profile.gender &&
    schemeGender !== "all" &&
    schemeGender !== profile.gender &&
    !(schemeGender === "transgender" && profile.gender === "other")
  ) {
    return false;
  }

  if (Array.isArray(elig.caste) && elig.caste.length > 0 && !elig.caste.map((c) => normalize(c)).includes("all")) {
    const schemeCastes = elig.caste.map((c) => normalize(c));
    if (profile.caste && !schemeCastes.includes(profile.caste)) return false;
  }

  const schemeIncomeLimit =
    typeof elig.incomeLimit === "number"
      ? elig.incomeLimit
      : (typeof elig.income === "number" ? elig.income : 0);
  if (schemeIncomeLimit > 0 && !profile.employment.includes("business")) {
    // Income unavailable in profile currently, so do not hard reject.
  }

  if (elig.employment) {
    const schemeEmployment = normalize(elig.employment);
    if (profile.employment && schemeEmployment !== "all" && !schemeEmployment.includes(profile.employment)) {
      return false;
    }
  }

  if (elig.education) {
    const e = normalize(elig.education);
    if (
      profile.education &&
      !["all", "any", "not required", "no minimum qualification"].includes(e) &&
      !e.includes(profile.education) &&
      !(e.includes("student") && profile.employment === "student")
    ) {
      return false;
    }
  }

  return true;
};

const rankSchemesByQuery = (query: string, list: SchemeItem[]) => {
  const q = normalize(query);
  const tokens = q.split(/\s+/).filter(Boolean);

  return list
    .map((scheme) => {
      const name = normalize(scheme.name || "");
      const category = normalize(scheme.category || "");
      const description = normalize(scheme.description || "");
      const state = normalize(scheme.state || "");

      let score = 0;
      if (name.includes(q)) score += 6;
      if (category.includes(q)) score += 3;
      if (description.includes(q)) score += 2;
      if (state.includes(q)) score += 2;

      for (const t of tokens) {
        if (name.includes(t)) score += 2;
        if (category.includes(t)) score += 1;
        if (description.includes(t)) score += 1;
      }

      return { scheme, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => r.scheme);
};

const Chatbot = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const initialMessages: Message[] = [
    {
      role: "assistant",
      content: "Hello! I am your Scheme Hub Assistant. Ask me about schemes, eligibility, documents, or application steps.",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateResponse = (userMessage: string) => {
    const text = normalize(userMessage);
    const userAge = calculateAge(user?.dob);
    const profile = {
      age: userAge,
      gender: normalize(user?.gender || ""),
      caste: normalize(user?.caste || ""),
      education: normalize(user?.education || ""),
      employment: normalize(user?.employment || ""),
      state: normalize(user?.state || ""),
    };

    const profileMatches = typedSchemes.filter((s) => schemeMatchesProfile(s, profile)).slice(0, 5);
    const totalSchemes = typedSchemes.length;
    const centralCount = typedSchemes.filter((s) => normalize(s.type || "") === "central").length;
    const stateCount = typedSchemes.filter((s) => normalize(s.type || "") === "state").length;
    const topCategories = [...new Set(typedSchemes.map((s) => s.category).filter(Boolean))].slice(0, 8);
    const websiteAboutText = `Scheme Hub is a Government Schemes Portal designed to help users discover and apply for welfare schemes easily.

Main website sections:
- Home
- All Schemes
- Central Schemes
- State Schemes
- Check Eligibility

What users can do:
- Search schemes by keyword and category
- Browse schemes by category
- View spotlight schemes
- Read latest News & Updates
- Check profile-based eligibility
- Access details, required documents, and official apply links

Quick overview shown on home:
- Total Schemes: ${totalSchemes}
- Central Schemes: ${centralCount}
- State Schemes: ${stateCount}

Platform strengths:
- Personalized recommendations from profile details
- Category-based browsing
- Spotlight schemes and latest updates
- Direct official application links
- Dashboard with saved schemes and documents`;

    const aboutMatch = text.match(/^about(?:\s+(.+))?$/);
    if (aboutMatch) {
      const aboutTarget = (aboutMatch[1] || "").trim();

      if (
        !aboutTarget ||
        containsAny(aboutTarget, ["website", "scheme hub", "platform", "portal"])
      ) {
        return websiteAboutText;
      }

      const cleanedTarget = aboutTarget
        .replace(/^scheme\s+/, "")
        .replace(/^the\s+scheme\s+/, "")
        .trim();

      if (!cleanedTarget) {
        return "Please provide a scheme name. Example: about PM-KISAN";
      }

      const aboutSchemeMatches = rankSchemesByQuery(cleanedTarget, typedSchemes);
      if (aboutSchemeMatches.length === 0) {
        return `I could not find a scheme named "${cleanedTarget}". Try the exact scheme name, for example: "about PM-KISAN".`;
      }

      const s = aboutSchemeMatches[0];
      return `About Scheme: ${s.name}
Type: ${s.type || "Not specified"}
State: ${s.state || "All India"}
Category: ${s.category || "Not specified"}
Description: ${s.description || "Not available"}
Official Link: ${s.official_link || "Not available"}

Ask "documents for ${s.name}" or "how to apply for ${s.name}" for more details.`;
    }

    if (containsAny(text, ["help", "menu", "what can you do", "commands"])) {
      return `I can help you with:
- Discovering schemes by keyword, category, and state
- Personalized eligibility suggestions using your profile
- Required documents and application steps
- Website navigation (All/Central/State/Eligibility pages)
- Legal/help pages (Terms, Disclaimer, FAQ, Contact)

Try asking:
1. "Top schemes for my profile"
2. "Show central schemes for students"
3. "Documents required for PM-KISAN"
4. "How to use this website?"`;
    }

    if (isGreeting(text)) {
      if (!isAuthenticated) {
        return "Hello! How can I help you today? Ask any question about schemes, eligibility, documents, or applications.";
      }
      return `Hello ${user?.firstName || "User"}! How can I help you today? Ask any question about schemes, eligibility, documents, or applications.`;
    }

    if (containsAny(text, ["my profile", "meri profile", "my details", "meri details"])) {
      if (!isAuthenticated) return "You are not logged in. Please log in to get profile-based smart answers.";
      return `Your profile snapshot:
- Age: ${userAge ?? "Not set"}
- Gender: ${user?.gender || "Not set"}
- State: ${user?.state || "Not set"}
- Caste: ${user?.caste || "Not set"}
- Education: ${user?.education || "Not set"}
- Employment: ${user?.employment || "Not set"}`;
    }

    if (containsAny(text, ["eligible", "eligibility", "mujhe kya milega", "mere liye scheme", "top scheme", "recommend"])) {
      if (!isAuthenticated) {
        return "For personalized eligibility results, please log in and complete your profile details. Then I can suggest exact scheme matches.";
      }
      if (profileMatches.length === 0) {
        return "No direct match found for your current profile. Please update your state, education, employment, and caste in Dashboard/Profile.";
      }
      return `Top schemes based on your profile:
${profileMatches.map((s, i) => `${i + 1}. ${s.name} (${s.type || "Scheme"}${s.state ? `, ${s.state}` : ""})`).join("\n")}

Type any scheme name to get detailed information.`;
    }

    if (containsAny(text, ["document", "documents", "paper", "aadhaar", "income certificate"])) {
      return "Common documents include: Aadhaar, income certificate, caste certificate, bank passbook, and residence proof. For exact requirements, share a specific scheme name.";
    }

    if (containsAny(text, ["apply", "application", "kaise apply", "how to apply"])) {
      return "Application flow: Open scheme details -> check eligibility -> prepare documents -> click 'Apply Now' -> submit on the official portal.";
    }

    if (containsAny(text, ["all schemes", "central schemes", "state schemes", "difference between central and state"])) {
      return `Website navigation guide:
- All Schemes: Full list of available schemes.
- Central Schemes: Schemes by Government of India (wider coverage).
- State Schemes: Schemes launched by specific state governments.
- Check Eligibility: Profile-based filtering to reduce manual effort.

Tip: Start with All Schemes, then narrow down by category and state.`;
    }

    if (containsAny(text, ["category", "categories", "browse by category"])) {
      return `You can browse schemes by category from the home page.

Popular categories:
- ${topCategories.join("\n- ")}

Tell me your need (for example: student, farmer, housing, health), and I will suggest relevant schemes.`;
    }

    if (containsAny(text, ["no schemes", "no result", "not showing scheme", "why no match"])) {
      return `If you are getting no matches, check:
1. Complete all profile fields (age, gender, caste, education, employment, state).
2. Select the correct state for state-level schemes.
3. Use realistic income range values in eligibility.
4. Start broad from All Schemes, then narrow.
5. Update profile in Dashboard and re-run eligibility.`;
    }

    if (containsAny(text, ["news", "latest", "update", "new schemes", "spotlight", "featured"])) {
      return "For latest updates, check the News and Spotlight sections on the Home page. You can also ask by category, like student, farmer, or women schemes.";
    }

    if (
      containsAny(text, [
        "about website",
        "about scheme hub",
        "website info",
        "platform info",
        "what is this website",
        "features of website",
      ])
    ) {
      return websiteAboutText;
    }

    if (
      containsAny(text, [
        "terms",
        "terms and conditions",
        "term and condition",
        "conditions",
        "legal",
        "rules",
        "policy",
      ])
    ) {
      return `Terms & Conditions (summary):
- Scheme information may change as per official government updates.
- Final eligibility is always decided by the concerned authority.
- Users must provide accurate details while using profile and eligibility tools.
- Scheme Hub provides guidance and navigation support, not guaranteed approval.
- Official application is completed only on government portals.

For full legal text, open the "Terms & Conditions" link in the website footer.`;
    }

    if (containsAny(text, ["disclaimer", "accuracy", "guarantee", "legal notice"])) {
      return `Disclaimer (summary):
- Scheme Hub aggregates scheme details for user convenience.
- Data is sourced from scheme records and can change over time.
- Eligibility results are indicative and not a final decision.
- Users should verify details on official government portals before applying.

You can open the full Disclaimer page from the footer under Legal.`;
    }

    if (containsAny(text, ["quick links", "footer", "contact", "faq", "accessibility", "government portals"])) {
      return `Useful website links:

Quick Links:
- About Us
- Contact Us
- Accessibility
- FAQ

Legal:
- Disclaimer
- Terms & Conditions
- Dashboard

Government Portals:
- DigiLocker
- UMANG
- MyGov
- Data.gov.in
- India.gov.in`;
    }

    const directMatches = rankSchemesByQuery(text, typedSchemes);
    if (directMatches.length > 0) {
      const top = directMatches[0];
      return `Best match: ${top.name}
Type: ${top.type || "Not specified"}
State: ${top.state || "All India"}
Category: ${top.category || "Not specified"}
Description: ${top.description || "Not available"}

Official Link: ${top.official_link || "Not available"}

Also matching:
${directMatches.slice(1, 4).map((s, i) => `${i + 1}. ${s.name}`).join("\n") || "No additional close matches."}

Reply with a scheme name for full details (documents, eligibility, and application steps).`;
    }

    return `I can help with scheme discovery, eligibility, documents, and application flow.

Try:
- "Top 5 schemes for my profile"
- "Show schemes for women in Maharashtra"
- "How to use Scheme Hub website?"
- "Terms and conditions summary"
- "Documents for PM-KISAN"`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      <button
        onClick={() => {
          if (isOpen) {
            setMessages(initialMessages);
            setInput("");
            setIsTyping(false);
          }
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] shadow-2xl flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-6 w-6" />
              Scheme Hub Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                    >
                      {message.content}
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2 text-sm">Typing...</div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type question... e.g. schemes for students in Bihar"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
