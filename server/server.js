const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let users = [];
let bookings = [];

app.post('/register', (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already registered.' });
  }
  const newUser = { id: users.length + 1, fullName, email, password };
  console.log('Before registration:', JSON.stringify(users.slice(0, -1)));
  users.push(newUser);
  console.log('After registration:', JSON.stringify(users));
  res.status(201).json({ success: true, message: 'Registration successful!', user: newUser });
});

app.post('/api/login', (req, res) => {
  const { username: email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }
  console.log('Login successful for user:', user);
  res.json({ success: true, message: 'Login successful!', user });
});

app.post('/bookings', (req, res) => {
  const { userId, workspace, date, time, duration } = req.body;
  if (!userId || !workspace || !date || !time || !duration) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (!users.some(u => u.id === userId)) {
    return res.status(400).json({ success: false, message: 'User not found.' });
  }
  const workspaceRates = { "Private office": 25, "Shared desk": 10, "Meeting room": 15 };
  const price = workspaceRates[workspace] * parseInt(duration);
  const newBooking = { id: bookings.length + 1, userId, workspace, date, time, duration, price };
  console.log('Before booking:', JSON.stringify(bookings.slice(0, -1)));
  bookings.push(newBooking);
  console.log('After booking:', JSON.stringify(bookings));
  res.status(201).json({ success: true, message: 'Booking confirmed!', booking: newBooking });
});

app.get('/bookings', (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID required.' });
  }
  const userBookings = bookings.filter(b => b.userId === userId);
  console.log('Bookings for user', userId, ':', JSON.stringify(userBookings));
  res.json({ success: true, bookings: userBookings });
});

app.delete('/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }
  console.log('Before delete:', JSON.stringify(bookings));
  bookings.splice(index, 1);
  console.log('After delete:', JSON.stringify(bookings));
  res.json({ success: true, message: 'Booking deleted.' });
});

app.delete('/bookings', (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID required.' });
  }
  console.log('Before clear all for user', userId, ':', JSON.stringify(bookings));
  bookings = bookings.filter(b => b.userId !== userId);
  console.log('After clear all:', JSON.stringify(bookings));
  res.json({ success: true, message: 'All bookings cleared.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});