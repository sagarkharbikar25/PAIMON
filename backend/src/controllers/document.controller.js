/* =============================================
   controllers/document.controller.js
   Pravas — Document Upload Controller
   ============================================= */

const path     = require('path');
const fs       = require('fs');
const Document = require('../models/document.model');

/* ─────────────────────────────────────────────
   POST /api/documents/upload
   Multipart form — field name: "file"
   Optional body fields: category, label, tripId
   ───────────────────────────────────────────── */
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { category = 'other', label = '', tripId = null } = req.body;

    /* Build the public URL — adjust BASE_URL if deploying */
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    const doc = await Document.create({
      user:     req.user._id,
      trip:     tripId || null,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      fileUrl,
      category,
      label:    label || req.file.originalname,
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err) {
    console.error('uploadDocument error:', err);
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/documents
   Returns all documents for the logged-in user
   Query params: ?tripId=xxx&category=flight
   ───────────────────────────────────────────── */
const getDocuments = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.tripId)   filter.trip     = req.query.tripId;
    if (req.query.category) filter.category = req.query.category;

    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, documents: docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────
   DELETE /api/documents/:id
   Deletes doc record + file from disk
   ───────────────────────────────────────────── */
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found.' });

    /* Remove file from disk */
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await doc.deleteOne();
    res.json({ success: true, message: 'Document deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadDocument, getDocuments, deleteDocument };