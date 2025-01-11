const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
  name: { type: String, required: true }, // Name of the contact person
  phoneNumber: { type: String, required: true }, // Contact person's phone number
  relationship: { type: String, required: true }, // Relationship to the user (e.g., "Friend", "Family")
  isPrimary: { type: Boolean, default: false } // Flag to indicate if this is the primary emergency contact
});

module.exports = mongoose.model('Contact', ContactSchema);
