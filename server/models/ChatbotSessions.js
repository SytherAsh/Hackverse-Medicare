const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const ChatSessionSchema = new Schema({
  sessionId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the chat session
  userId: { type: Types.ObjectId, ref: 'User', required: true }, // References to the User schema
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }], // References to messages in the session
  createdAt: { type: Date, default: Date.now }, // Date of creation
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
