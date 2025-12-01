import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      default: 'Organisateur'
    },
    role: {
      type: String,
      enum: ['admin', 'scanner'],
      default: 'admin'
    }
  },
  { timestamps: true }
);

export const Admin = mongoose.model('Admin', adminSchema);

