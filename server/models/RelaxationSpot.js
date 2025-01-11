const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const RelaxationSpotSchema = new Schema({
  spotId: { type: Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Unique identifier for the spot
  name: { type: String, required: true }, // Name of the relaxation spot
  location: { 
    type: { type: String, default: 'Point' }, // GeoJSON type (e.g., Point)
    coordinates: { type: [Number], required: true } // Coordinates [longitude, latitude]
  },
  description: { type: String, required: true }, // Description of the relaxation spot
  images: [{ type: String }], // Array of image URLs
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }], // References to the reviews collection
  createdAt: { type: Date, default: Date.now }, // Date of creation
});

module.exports = mongoose.model('RelaxationSpot', RelaxationSpotSchema);
