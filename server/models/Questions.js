const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const QuestionSchema = new Schema({
  id: { type: Number, required: true },  // Unique identifier for the question
  question: { type: String, required: true },  // The question text
  options: [{ type: String, required: true }],  // Array of answer options
});

module.exports = mongoose.model('Question', QuestionSchema);
