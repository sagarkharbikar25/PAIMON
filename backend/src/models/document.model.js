/* =============================================
   models/document.model.js
   Pravas — Document / Ticket Model
   ============================================= */

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  /* Owner */
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  /* Optional — link doc to a specific trip */
  trip:     { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },

  /* File info */
  fileName:     { type: String, required: true },           // original file name
  fileType:     { type: String, required: true },           // mime type: application/pdf | image/jpeg | image/png
  fileSize:     { type: Number, required: true },           // bytes
  filePath:     { type: String, required: true },           // path on disk: uploads/documents/<filename>
  fileUrl:      { type: String, required: true },           // URL to access the file

  /* Document category */
  category: {
    type:    String,
    enum:    ['flight', 'hotel', 'train', 'bus', 'passport', 'visa', 'insurance', 'other'],
    default: 'other',
  },

  /* Display label — user can rename */
  label:    { type: String, default: '' },

}, { timestamps: true });

documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ trip: 1 });

module.exports = mongoose.model('Document', documentSchema);