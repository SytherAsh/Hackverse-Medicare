const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const MoodLogSchema = new Schema({
  logId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() },
  userId: { type: Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
  moodScore: { type: Number, required: true }, // Numerical score, e.g., 1-10
  emotionTags: [{ type: String }], // Array of emotion tags, e.g., ["happy", "anxious"]
  analysisInsights: { type: String }, // ML-generated mood trend analysis
  createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('MoodLog', MoodLogSchema);
