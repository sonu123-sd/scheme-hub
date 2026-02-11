const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/document.controller");

/* ✅ AB ye sahi jagah hai */
console.log("deleteDocument =>", controller.deleteDocument);

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  controller.uploadDocument
);

router.get("/", authMiddleware, controller.getDocuments);

router.delete(
  "/:docType",
  authMiddleware,
  controller.deleteDocument
);

module.exports = router;
