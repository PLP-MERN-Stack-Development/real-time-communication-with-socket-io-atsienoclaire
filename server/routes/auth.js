// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'username taken' });
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new User({ username, password: hashed, email });
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, username: user.username }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'invalid credentials' });
    // if no password set on user, allow login by username only (useful for demo)
    if (!user.password && !password) {
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: { id: user._id, username: user.username }, token });
    }
    const match = await bcrypt.compare(password || '', user.password || '');
    if (!match) return res.status(400).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, username: user.username }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
