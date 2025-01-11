const mongoose = require('mongoose');
  const { Schema, Types } = mongoose;

  const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, enum: [5150, 1984], default: 1984 },
    moodLogs: { type: Array }, // Generic array for mood logs
    online: { type: Boolean, default: false },
    socketId: { type: String },

    therapyPlan: [{
      tip: { type: String, required: true },
      dateSuggested: { type: Date, default: Date.now }
    }],  

    emergencyContacts: [{
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String }
    }], 

    affirmationsEnabled: { type: Boolean, default: false },

    habits: [{
      habitName: { type: String, required: true },
      startDate: { type: Date, default: Date.now },
      frequency: { type: String, required: true },
      completionDates: [Date]
    }], 
    
    journalSettings: {
      defaultPrivacy: { type: Boolean, default: true },
      enableMoodTracking: { type: Boolean, default: true },
      enableLocationTracking: { type: Boolean, default: false },
      enableWeatherTracking: { type: Boolean, default: true },
      reminderFrequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'none'],
        default: 'none'
      },
      reminderTime: { type: String },
      customPrompts: [{
        text: String,
        isActive: Boolean
      }]
    },

    journals: [{ type: Types.ObjectId, ref: 'Journal' }]  , 

    chatroomIds: [{ type: Types.ObjectId, ref: 'Chatroom' }], 

    videoChatSessions: [{
      sessionId: { type: String, required: true },
      participants: [Types.ObjectId],  
      date: { type: Date, default: Date.now },
      duration: { type: Number }
    }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

    
  });

  module.exports = mongoose.model('User', UserSchema);