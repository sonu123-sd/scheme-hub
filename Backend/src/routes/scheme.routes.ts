const express = require("express");
const router = express.Router();

const { searchSchemeByName } = require("../controllers/scheme.controller");

router.get("/search", searchSchemeByName);

module.exports = router;
