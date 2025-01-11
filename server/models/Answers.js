const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const AnswerSchema = new Schema({
  question_id: { 
    type: Number, 
    required: true // References the Question document
  },
  option_index: { 
    type: Number, 
    required: true, 
    enum: [0, 1, 2, 3] // Only accepts the indices of the options (0, 1, 2, 3)
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Answer', AnswerSchema);
