const express = require('express');
const router = express.Router();
const { get, run } = require('../database');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'om-hospital-salt').digest('hex');
}

// Sign Up
router.post('/signup', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Please fill all fields' });
  }
  const existing = get('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    return res.json({ success: false, message: 'Email already registered' });
  }
  const hashed = hashPassword(password);
  const result = run('INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashed, phone || '', 'patient']);
  req.session.userId = result.lastInsertRowid;
  req.session.role = 'patient';
  req.session.name = name;
  res.json({ success: true, role: 'patient' });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'Please fill all fields' });
  }
  const hashed = hashPassword(password);
  const user = get('SELECT * FROM users WHERE email = ? AND password = ?', [email, hashed]);
  if (!user) {
    return res.json({ success: false, message: 'Invalid email or password' });
  }
  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.name = user.name;
  res.json({ success: true, role: user.role });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.json({ success: false, user: null });
  }
  const user = get('SELECT id, name, email, phone, role FROM users WHERE id = ?', [req.session.userId]);
  res.json({ success: true, user });
});

module.exports = router;
