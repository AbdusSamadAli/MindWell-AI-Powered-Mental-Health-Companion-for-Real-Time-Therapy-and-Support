const Document = require("../models/documentModel");

async function findOrCreateDocument(documentId) {
  try {
    let document = await Document.findById(documentId);
    if (!document) {
      document = await Document.create({ _id: documentId, data: {} });
    }
    return document;
  } catch (error) {
    console.error(`Error finding/creating document:`, error);
    throw error;
  }
}

async function saveDocument(req, res) {
  const { id, data } = req.body;
  try {
    const document = await Document.findOneAndUpdate(
      { _id: id },
      { data },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Document saved successfully", document });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { findOrCreateDocument, saveDocument };
