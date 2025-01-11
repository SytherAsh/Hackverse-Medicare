const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const JournalSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { 
    type: String, 
    enum: ['happy', 'sad', 'anxious', 'neutral', 'excited', 'angry'],
    required: true 
  },
  tags: [{ type: String }],
  images: [{ 
    url: String,
    caption: String
  }],
  isPrivate: { type: Boolean, default: true },
  location: {
    type: { type: String },
    coordinates: [Number]
  },
  weather: {
    condition: String,
    temperature: Number
  },
  activities: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add text index for search functionality
JournalSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Journal', JournalSchema);