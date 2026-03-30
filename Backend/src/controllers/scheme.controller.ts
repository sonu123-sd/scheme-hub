const Scheme = require("../models/Scheme.model");

const normalize = (value: any) => (value || "").toString().trim().toLowerCase();
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const rankScheme = (query: string, scheme: any) => {
  const q = normalize(query);
  const name = normalize(scheme?.name);
  const id = normalize(scheme?.id);
  const category = normalize(scheme?.category);
  const state = normalize(scheme?.state);
  const description = normalize(scheme?.description);

  let score = 0;

  if (name === q) score += 120;
  if (id === q) score += 100;
  if (name.startsWith(q)) score += 45;
  if (id.startsWith(q)) score += 30;
  if (name.includes(q)) score += 24;
  if (id.includes(q)) score += 18;
  if (category.includes(q)) score += 8;
  if (state.includes(q)) score += 7;
  if (description.includes(q)) score += 5;

  const tokens = q.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    if (name.includes(token)) score += 7;
    if (category.includes(token)) score += 3;
    if (state.includes(token)) score += 2;
    if (description.includes(token)) score += 1;
  }

  return score;
};

exports.searchSchemeByName = async (req: any, res: any) => {
  try {
    const rawName = (req.query?.name || "").toString().trim();
    if (!rawName) {
      return res.status(400).json({ message: "Scheme name is required" });
    }

    const safeRegex = new RegExp(escapeRegex(rawName), "i");

    const matchedSchemes = await Scheme.find({
      $or: [
        { name: safeRegex },
        { id: safeRegex },
      ],
    }).limit(25);

    if (!matchedSchemes.length) {
      return res.status(404).json({ message: "No matching scheme found" });
    }

    const bestMatch = matchedSchemes
      .map((scheme: any) => ({ scheme, score: rankScheme(rawName, scheme) }))
      .sort((a: any, b: any) => b.score - a.score)[0];

    return res.status(200).json({
      success: true,
      data: bestMatch.scheme,
    });
  } catch (error) {
    console.error("Scheme search error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
