import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },  // Optional, for quick ref
  dateFrom: Date,
  dateTo: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);