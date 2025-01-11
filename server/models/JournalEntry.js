const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const JournalEntrySchema = new Schema({
  entryId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the journal entry
  userId: { type: Types.ObjectId, ref: 'User', required: true }, // References to the User schema
  content: { type: String, required: true }, // Content of the journal entry
  sentimentScore: { type: Number, required: true }, // Sentiment score (e.g., from NLP analysis)
  createdAt: { type: Date, default: Date.now }, // Date of creation
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
