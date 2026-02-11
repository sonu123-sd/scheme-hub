const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

router.post("/change-password", auth, accountController.changePassword);
router.put("/notifications", auth, accountController.updateNotifications);
router.post("/logout-all", auth, accountController.logoutAllDevices);
router.delete("/delete", auth, accountController.deleteAccount);

module.exports = router;
