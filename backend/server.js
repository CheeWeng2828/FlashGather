// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Event = require('./models/Event');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 连接数据库并启动服务器
connectDB().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to connect DB, exiting.');
  process.exit(1);
});

// Routes

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// List events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ time: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

// Create event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, time, location, capacity } = req.body;

    // 后端 validation（必须）
    if (!title || !time) {
      return res.status(400).json({ error: 'title and time required' });
    }
    const event = new Event({
      title,
      description,
      time: new Date(time), // 确保为 Date 类型
      location,
      capacity: capacity ? Number(capacity) : undefined,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Get single
app.get('/api/events/:id', async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ error: 'not found' });
    res.json(e);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

// RSVP
app.post('/api/events/:id/rsvp', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'event not found' });

    // capacity check
    if (event.capacity && event.rsvps.length >= event.capacity) {
      return res.status(400).json({ error: 'event is full' });
    }

    // duplicate check
    if (event.rsvps.some(r => r.email === email)) {
      return res.status(400).json({ error: 'already registered' });
    }

    event.rsvps.push({ name, email });
    await event.save();
    res.status(201).json({ ok: true, total: event.rsvps.length });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});
