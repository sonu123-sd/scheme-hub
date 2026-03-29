const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  saveApplicationStatus,
  getUserApplications,
  getMyApplications,
  updateApplicationStatus,
  getApplicationSummary,
  getAllApplications,
} = require("../controllers/schemeApplication.controller");

// Required workflow endpoints
router.post("/apply", authMiddleware, saveApplicationStatus);
router.get("/user/:userId/applications", authMiddleware, getUserApplications);

// User convenience endpoints
router.get("/applications/me", authMiddleware, getMyApplications);
router.put("/apply/:schemeId", authMiddleware, updateApplicationStatus);

// Developer/admin visibility endpoints (currently protected by auth)
router.get("/admin/applications", authMiddleware, getAllApplications);
router.get("/admin/applications/summary", authMiddleware, getApplicationSummary);

module.exports = router;
