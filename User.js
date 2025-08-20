import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },  // email
  phone: { type: String, required: true },
  role: { type: String, enum: ['coworker', 'owner'], default: 'coworker' },
  password: { type: String, required: true },
  contact: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);