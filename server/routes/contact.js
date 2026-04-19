const express = require('express');
const router = express.Router();
const { all, get, run } = require('../database');

// POST /api/contact
router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ success: false, error: 'Name, email, subject, and message are required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email' });
  const result = run('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)', [name, email, phone || '', subject, message]);
  res.status(201).json({ success: true, message: 'Thank you! We will get back to you shortly.', data: { id: result.lastInsertRowid } });
});

// GET /api/contact
router.get('/', (req, res) => {
  res.json({ success: true, data: all('SELECT * FROM contact_messages ORDER BY created_at DESC') });
});

// PATCH /api/contact/:id/read
router.patch('/:id/read', (req, res) => {
  const existing = get('SELECT * FROM contact_messages WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ success: false, error: 'Message not found' });
  run('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Marked as read' });
});

module.exports = router;
