const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const CrisisResourceSchema = new Schema({
  resourceId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the resource
  title: { type: String, required: true }, // Title of the resource (e.g., "Suicide Prevention Hotline")
  description: { type: String, required: true }, // A description of the resource
  contactNumbers: [{ type: String }], // An array of emergency contact numbers (e.g., hotline numbers)
  resourceLinks: [{ type: String }] // An array of URLs for additional information or resources
});

module.exports = mongoose.model('CrisisResource', CrisisResourceSchema);
