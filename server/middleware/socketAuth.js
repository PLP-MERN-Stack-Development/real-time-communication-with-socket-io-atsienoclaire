// middleware/socketAuth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const User = require('../models/User');

async function verifySocketToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).lean();
    if (!user) return null;
    return { id: user._id, username: user.username };
  } catch (err) {
    return null;
  }
}

module.exports = { verifySocketToken };
