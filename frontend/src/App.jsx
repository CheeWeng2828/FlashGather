// src/App.jsx
import React, { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api';

function EventList({ events, onRefresh }) {
  return (
    <div>
      <h2>活动列表</h2>
      {events.length === 0 && <p>暂无活动，快去创建一个！</p>}
      <ul>
        {events.map(ev => (
          <li key={ev.id} style={{border: '1px solid #ddd', margin: 8, padding: 8}}>
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <p><strong>时间:</strong> {ev.time}</p>
            <p><strong>地点:</strong> {ev.location}</p>
            <p><strong>报名:</strong> {ev.rsvps?.length || 0}</p>
          </li>
        ))}
      </ul>
      <button onClick={onRefresh}>刷新</button>
    </div>
  );
}

function CreateEvent({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', time: '', location: '', capacity: '' });
  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const data = await res.json();
      onCreated(data);
      setForm({ title: '', description: '', time: '', location: '', capacity: '' });
    } else {
      const err = await res.json();
      alert('错误: ' + (err.error || 'unknown'));
    }
  };
  return (
    <form onSubmit={submit} style={{marginTop: 16}}>
      <h2>创建活动</h2>
      <div><input required placeholder="标题" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /></div>
      <div><input placeholder="时间（例如 2026-02-14 19:00）" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} /></div>
      <div><input placeholder="地点" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} /></div>
      <div><textarea placeholder="描述" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></div>
      <div><input placeholder="容量（可选）" value={form.capacity} onChange={e=>setForm({...form, capacity:e.target.value})} /></div>
      <button type="submit">创建</button>
    </form>
  );
}

export default function App() {
  const [events, setEvents] = useState([]);
  const fetchEvents = async () => {
    const res = await fetch(`${API}/events`);
    const data = await res.json();
    setEvents(data);
  };
  useEffect(()=>{ fetchEvents(); }, []);
  return (
    <div style={{ padding: 20 }}>
      <h1>FlashGather（闪聚）</h1>
      <CreateEvent onCreated={() => fetchEvents()} />
      <EventList events={events} onRefresh={fetchEvents} />
    </div>
  );
}
