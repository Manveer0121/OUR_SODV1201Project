import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import authMiddleware from './middleware/auth.js';
import User from './models/User.js';
import Property from './models/Property.js';
import Workspace from './models/Workspace.js';
import Booking from './models/Booking.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/register', async (req, res) => {
  const { fullName, email, phone, role, password } = req.body;
  if (!fullName || !email || !role || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  try {
    let user = await User.findOne({ username: email });
    if (user) return res.status(409).json({ success: false, message: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      fullName,
      username: email,
      phone,
      role,
      password: hashedPassword,
      contact: role === 'owner' ? email : null
    });
    await user.save();
    res.json({ success: true, user: { id: user._id, role: user.role, contact: user.contact, fullName: user.fullName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      success: true,
      user: { id: user._id, role: user.role, contact: user.contact, fullName: user.fullName },
      token  // Added for JWT
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Search & Workspaces (Public)
app.get('/search', async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  try {
    const propertiesList = await Property.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });
    const results = await Promise.all(propertiesList.map(async (p) => {
      const wss = await Workspace.find({ propertyId: p._id });
      const filteredWss = wss.filter(w =>
        w.name.toLowerCase().includes(q) || w.type.toLowerCase().includes(q)
      );
      return filteredWss.length > 0 ? { property: p, workspaces: filteredWss } : null;
    }));
    res.json({ success: true, results: results.filter(r => r !== null) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/workspaces/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const ws = await Workspace.findById(id);
    if (!ws) return res.status(404).json({ success: false, message: 'Workspace not found' });
    const property = await Property.findById(ws.propertyId);
    res.json({ success: true, workspace: ws, property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Bookings (Protected)
app.post('/bookings', authMiddleware, async (req, res) => {
  const { workspaceId, dateFrom = null, dateTo = null } = req.body;
  const userId = req.user.id;
  try {
    const ws = await Workspace.findById(workspaceId);
    if (!ws) return res.status(404).json({ success: false, message: 'Workspace not found' });
    const booking = new Booking({
      userId,
      workspaceId,
      propertyId: ws.propertyId,
      dateFrom,
      dateTo
    });
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/bookings', authMiddleware, async (req, res) => {
  const userId = req.query.userId;
  if (!userId || userId !== req.user.id) return res.status(400).json({ success: false, message: 'Unauthorized or missing userId' });
  try {
    const list = await Booking.find({ userId }).populate('workspaceId propertyId');
    res.json({ success: true, bookings: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/bookings/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const booking = await Booking.findById(id);
    if (!booking || booking.userId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Booking not found or unauthorized' });
    }
    await booking.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Owner Routes (Protected, owner role only)
app.post('/properties', authMiddleware, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ success: false, message: 'Not authorized' });
  const { address, neighborhood, sqft, garage, publicTransport, name, city, description } = req.body;
  try {
    const property = new Property({
      ownerId: req.user.id,
      address,
      neighborhood,
      sqft,
      garage,
      publicTransport,
      name,
      city,
      description
    });
    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/properties/owner/:ownerId', authMiddleware, async (req, res) => {
  if (req.user.id !== req.params.ownerId) return res.status(403).json({ success: false, message: 'Not authorized' });
  try {
    const properties = await Property.find({ ownerId: req.params.ownerId });
    res.json({ success: true, properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/properties/:propertyId/workspaces', authMiddleware, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ success: false, message: 'Not authorized' });
  const propertyId = req.params.propertyId;
  try {
    const property = await Property.findById(propertyId);
    if (!property || property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized for this property' });
    }
    const workspace = new Workspace({ propertyId, ...req.body });
    await workspace.save();
    res.json({ success: true, workspace });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/properties/:propertyId/workspaces', authMiddleware, async (req, res) => {
  const propertyId = req.params.propertyId;
  try {
    const property = await Property.findById(propertyId);
    if (!property || property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const workspaces = await Workspace.find({ propertyId });
    res.json({ success: true, workspaces });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Phase 2 server running on http://localhost:${PORT}`));