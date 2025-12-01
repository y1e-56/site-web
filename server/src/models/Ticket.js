import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    whatsappNumber: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1
    },
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['orange-money', 'mtn-money'],
      required: true
    },
    paymentReference: {
      type: String,
      required: true,
      trim: true
    },
    preferredChannel: {
      type: String,
      enum: ['whatsapp', 'sms', 'email', 'instagram', 'snapchat'],
      required: true
    },
    channelAddress: {
      type: String,
      trim: true,
      required: true
    },
    deliveryAttempts: {
      type: Number,
      default: 0
    },
    deliveryLastError: {
      type: String,
      trim: true
    },
    lastDeliveryAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'sent', 'checked_in'],
      default: 'pending'
    },
    qrPayload: String,
    qrImage: String,
    qrSentAt: Date,
    lastScanAt: Date,
    notes: String
  },
  { timestamps: true }
);

ticketSchema.index({ paymentReference: 1 }, { unique: true });

export const Ticket = mongoose.model('Ticket', ticketSchema);

