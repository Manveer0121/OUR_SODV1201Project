import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  name: String,
  type: String,  // e.g., 'desk', 'meeting', 'office'
  meetingRoom: Boolean,
  privateOffice: Boolean,
  openDesk: Boolean,
  seats: Number,
  smoking: Boolean,
  availability: String,
  term: String,
  price: Number,
  pricePerDay: Number,
  pricePerHour: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Workspace', workspaceSchema);