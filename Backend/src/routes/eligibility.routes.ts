const express = require("express");
const router = express.Router();

const { checkEligibility } = require("../controllers/eligibility.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/check", authMiddleware, checkEligibility);

module.exports = router;
