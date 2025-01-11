const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

// Message Schema
const messageSchema = new Schema({
  sender: { type: Types.ObjectId, ref: 'User', required: true }, // References User schema
  receiver: { type: Types.ObjectId, ref: 'User' }, // Optional for direct messages
  room: { type: Types.ObjectId, ref: 'Room' }, // Optional, for room messages
  content: { type: String, required: true },
  messageType: { type: String, enum: ['room', 'direct'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Room Schema
const roomSchema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['predefined', 'custom'], required: true },
  description: String
});

const Room = mongoose.model('Room', roomSchema);

// Function to initialize predefined rooms
async function initializePredefinedRooms() {
  const predefinedRooms = [
    { name: 'General', type: 'predefined', description: 'General discussion' },
    { name: 'Technology', type: 'predefined', description: 'Tech discussions' },
    { name: 'Random', type: 'predefined', description: 'Random chats' }
  ];

  try {
    for (const room of predefinedRooms) {
      await Room.findOneAndUpdate(
        { name: room.name },
        room,
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Error initializing predefined rooms:', error);
  }
}

// Exporting the schemas and initialization function
module.exports = { Message, Room, initializePredefinedRooms };
