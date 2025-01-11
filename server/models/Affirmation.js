const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const AffirmationSchema = new Schema({
  affirmationId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the affirmation
  message: { type: String, required: true }, // Text of the affirmation
  category: { type: String, required: true }, // Category of the affirmation (e.g., "Motivation", "Calmness")
  createdAt: { type: Date, default: Date.now }, // Date of creation
});

module.exports = mongoose.model('Affirmation', AffirmationSchema);
