const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the Event model
const eventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  mode: { type: String, enum: ['video', 'offline'], required: true }, // Added mode field
}, { timestamps: true });

// Pre-save hook to generate a unique numeric ID before saving (if required)
const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;
