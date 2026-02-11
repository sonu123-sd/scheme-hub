const User = require("../models/User.model");

// REMOVE SCHEME
const removeScheme = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { schemeId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedSchemes = user.savedSchemes.filter(
      (id: any) => id.toString() !== schemeId.toString()
    );

    await user.save();
    return res.status(200).json({
      message: "Scheme removed",
      savedSchemes: user.savedSchemes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Remove failed" });
  }
};

// SAVE SCHEME
const saveScheme = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { schemeId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedSchemes.includes(schemeId)) {
      return res.status(400).json({ message: "Already saved" });
    }

    user.savedSchemes.push(schemeId);
    await user.save();

    return res.status(200).json({
      message: "Scheme saved",
      savedSchemes: user.savedSchemes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Save failed" });
  }
};

module.exports = { saveScheme, removeScheme };
