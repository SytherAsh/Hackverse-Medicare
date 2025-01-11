const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const ExerciseResourceSchema = new Schema({
  resourceId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the resource
  title: { type: String, required: true }, // Title of the exercise resource
  videoUrl: { type: String, required: true }, // URL for the exercise video
  description: { type: String, required: true }, // Description of the exercise resource
});

module.exports = mongoose.model('ExerciseResource', ExerciseResourceSchema);
