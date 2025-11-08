// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const multer = require('multer');
const path = require('path');

// file upload setup
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// GET /api/messages?room=global&before=<id>&limit=20
router.get('/', async (req, res) => {
  try {
    const { before, limit = 20, room = 'global', q } = req.query;
    const query = { room };
    if (before) {
      query._id = { $lt: before };
    }
    if (q) {
      query.message = { $regex: q, $options: 'i' };
    }
    const messages = await Message.find(query).sort({ _id: -1 }).limit(parseInt(limit, 10)).lean();
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// upload file
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/uploads/${req.file.filename}`;
  res.json({ url, originalname: req.file.originalname });
});

module.exports = router;
