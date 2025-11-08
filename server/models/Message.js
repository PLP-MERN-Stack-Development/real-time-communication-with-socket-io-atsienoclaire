// models/Message.js
const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    username: { type: String, required: true }
  },
  room: { type: String, default: 'global' },
  message: { type: String, default: '' },
  attachments: [{ url: String, originalname: String }],
  isPrivate: { type: Boolean, default: false },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reactions: { type: Map, of: [ReactionSchema] } // map from reaction string -> array of ReactionSchema
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
