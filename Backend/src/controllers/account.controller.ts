const bcrypt = require("bcryptjs");
const User = require("../models/User.model");


/*
POST /api/account/change-password
*/
exports.changePassword = async (req: any, res: any) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;   // auth middleware se aa raha

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // 🔐 security: sab devices se logout
    user.tokens = [];

    await user.save();

    res.status(200).json({
      message: "Password updated successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
};
/*
PUT /api/account/notifications
*/
exports.updateNotifications = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notifications = {
      schemeUpdates: req.body.schemeUpdates,
      eligibilityAlerts: req.body.eligibilityAlerts,
      applicationReminders: req.body.applicationReminders,
      newsletter: req.body.newsletter
    };

    await user.save();

    res.status(200).json({
      message: "Notification settings updated"
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};
/*
POST /api/account/logout-all
*/
exports.logoutAllDevices = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, {
      tokens: []
    });

    res.status(200).json({
      message: "Logged out from all devices"
    });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};
/*
DELETE /api/account/delete
*/
exports.deleteAccount = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Account deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
