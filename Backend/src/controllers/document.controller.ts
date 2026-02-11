const Document = require("../models/Document.model");

const uploadDocument = async (req: any, res: any) => {
  try {
    const { docType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const document = new Document({
      userId: req.user.userId,
      docType,
      fileUrl: req.file.path,
    });

    await document.save();

    res.status(201).json({ message: "Document uploaded" });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};

const getDocuments = async (req: any, res: any) => {
  const docs = await Document.find({ userId: req.user.userId });
  res.json(docs);
};

/* ✅ YE FUNCTION PEHLE MISSING THA */
const deleteDocument = async (req: any, res: any) => {
  try {
    const { docType } = req.params;

    const deleted = await Document.findOneAndDelete({
      userId: req.user.userId,
      docType,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ✅ VERY IMPORTANT */
module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
};
