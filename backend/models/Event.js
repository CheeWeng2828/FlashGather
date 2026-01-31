// backend/models/Event.js
const mongoose = require('mongoose');

const RsvpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  time: { type: Date, required: true },
  location: String,
  capacity: Number,
  createdAt: { type: Date, default: Date.now },
  rsvps: [RsvpSchema],
});

module.exports = mongoose.model('Event', EventSchema);
