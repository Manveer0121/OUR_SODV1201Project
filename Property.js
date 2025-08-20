import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  city: String,
  address: { type: String, required: true },
  neighborhood: String,
  sqft: Number,
  garage: Boolean,
  publicTransport: Boolean,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Property', propertySchema);