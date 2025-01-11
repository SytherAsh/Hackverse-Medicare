const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const TherapistSchema = new Schema({
  therapistId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the therapist
  name: { type: String, required: true }, // Name of the therapist
  specialization: [{ type: String }], // List of specializations (e.g., ["CBT", "Mindfulness"])
  
  // Contact info embedded directly in the Therapist schema
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String } // Optional address field
  },
  
  rating: { type: Number, default: 0 }, // Average rating (0 if no reviews)
  
  // Reviews embedded directly in the Therapist schema
  reviews: [{
    userId: { type: Types.ObjectId, ref: 'User', required: true }, // Reference to the User who left the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    comment: { type: String }, // Optional comment by the user
    createdAt: { type: Date, default: Date.now } // Timestamp when the review was created
  }],
  
  // Availability time slots embedded directly in the Therapist schema
  availability: [{
    day: { type: String, required: true }, // Day of the week (e.g., "Monday", "Tuesday")
    startTime: { type: String, required: true }, // Start time of the slot (e.g., "9:00 AM")
    endTime: { type: String, required: true }  // End time of the slot (e.g., "10:00 AM")
  }],
  
  createdAt: { type: Date, default: Date.now } // Timestamp when the therapist is added
});

module.exports = mongoose.model('Therapist', TherapistSchema);
