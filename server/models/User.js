// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String }, // hashed
  avatarUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
