
import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      required: true,   
      trim: true,
    },

    summary: {
      type: String,
      default: '',      
    },

    aiTasks: [
      {
        title: {
          type: String,
        },
        priority: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium',
        },
        isAdded: {
          type: Boolean,
          default: false, 
        },
      },
    ],

    isSummarized: {
      type: Boolean,
      default: false,   
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Meeting', meetingSchema);