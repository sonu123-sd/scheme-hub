const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  saveScheme,
  removeScheme,
} = require("../controllers/savedScheme.controller");

// SAVE
router.post("/", authMiddleware, saveScheme);

// DELETE
router.delete("/:schemeId", authMiddleware, removeScheme);

module.exports = router;
