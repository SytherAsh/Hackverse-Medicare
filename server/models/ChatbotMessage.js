const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const MessageSchema = new Schema({
  messageId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the message
  sessionId: { type: Types.ObjectId, ref: 'ChatSession', required: true }, // References to the ChatSession schema
  sender: { type: String, required: true }, // "user" or "bot" (the sender of the message)
  content: { type: String, required: true }, // Content of the message
  createdAt: { type: Date, default: Date.now }, // Date of message creation
});

module.exports = mongoose.model('Message', MessageSchema);
