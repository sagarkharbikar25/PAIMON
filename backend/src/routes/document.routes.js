/* =============================================
   routes/document.routes.js
   Pravas — Document Upload Routes
   ============================================= */

const path    = require('path');
const fs      = require('fs');
const router  = require('express').Router();
const multer  = require('multer');
const { protect } = require('../middleware/auth.middleware');const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require('../controllers/document.controller');

/* ── Upload directory ────────────────────────
   Files saved to: backend/uploads/documents/
   ─────────────────────────────────────────── */
const UPLOAD_DIR = path.join(__dirname, '../../uploads/documents');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ── Multer config ───────────────────────────*/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext    = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

/* ── Routes ─────────────────────────────────*/
router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/',        protect, getDocuments);
router.delete('/:id',  protect, deleteDocument);

/* ── Multer error handler ────────────────────*/
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Upload failed.' });
});

module.exports = router;