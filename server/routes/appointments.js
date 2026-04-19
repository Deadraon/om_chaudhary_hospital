const express = require('express');
const router = express.Router();
const { all, get, run } = require('../database');

// Get user's appointments
router.get('/user/:userId', (req, res) => {
  if (!req.session.userId || req.session.userId != req.params.userId) {
    return res.json({ success: false, message: 'Unauthorized' });
  }
  const appointments = all(
    `SELECT a.*, d.name as department_name, doc.name as doctor_name 
     FROM appointments a 
     JOIN departments d ON a.department_id = d.id 
     JOIN doctors doc ON a.doctor_id = doc.id 
     WHERE a.user_id = ? 
     ORDER BY a.created_at DESC`,
    [req.params.userId]
  );
  res.json({ success: true, data: appointments });
});

// Get all appointments (admin)
router.get('/', (req, res) => {
  const appointments = all(
    `SELECT a.*, d.name as department_name, doc.name as doctor_name 
     FROM appointments a 
     JOIN departments d ON a.department_id = d.id 
     JOIN doctors doc ON a.doctor_id = doc.id 
     ORDER BY a.created_at DESC`
  );
  res.json({ success: true, data: appointments });
});

// Book appointment
router.post('/', (req, res) => {
  const { patient_name, patient_email, patient_phone, department_id, doctor_id, appointment_date, appointment_time, message } = req.body;
  if (!patient_name || !patient_email || !patient_phone || !department_id || !doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }
  const userId = req.session.userId || null;
  const result = run(
    'INSERT INTO appointments (user_id, patient_name, patient_email, patient_phone, department_id, doctor_id, appointment_date, appointment_time, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, patient_name, patient_email, patient_phone, department_id, doctor_id, appointment_date, appointment_time, message || '']
  );
  res.json({ success: true, data: { id: result.lastInsertRowid } });
});

// Update appointment status (admin)
router.patch('/:id', (req, res) => {
  const { status } = req.body;
  run('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ success: true });
});

module.exports = router;
