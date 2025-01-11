const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const HabitLogSchema = new Schema({
  habitId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the habit
  userId: { type: Types.ObjectId, ref: 'User', required: true }, // References to the User schema
  habitName: { type: String, required: true }, // Name of the habit
  goal: { type: String, required: true }, // Description of the habit goal
  progress: { type: Number, required: true }, // Percentage progress toward the goal
  lastUpdated: { type: Date, default: Date.now }, // Date of last update
});

module.exports = mongoose.model('HabitLog', HabitLogSchema);
