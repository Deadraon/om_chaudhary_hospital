const express = require('express');
const router = express.Router();
const { all, get, run } = require('../database');

// POST /api/appointments
router.post('/', (req, res) => {
  const { patient_name, patient_email, patient_phone, department_id, doctor_id, appointment_date, appointment_time, message } = req.body;
  if (!patient_name || !patient_email || !patient_phone || !department_id || !doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ success: false, error: 'All required fields must be filled' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient_email)) return res.status(400).json({ success: false, error: 'Invalid email' });

  const doctor = get('SELECT * FROM doctors WHERE id = ? AND department_id = ?', [doctor_id, department_id]);
  if (!doctor) return res.status(400).json({ success: false, error: 'Invalid doctor or department' });

  const result = run(
    'INSERT INTO appointments (patient_name, patient_email, patient_phone, department_id, doctor_id, appointment_date, appointment_time, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [patient_name, patient_email, patient_phone, department_id, doctor_id, appointment_date, appointment_time, message || '']
  );
  res.status(201).json({ success: true, message: 'Appointment booked successfully! We will confirm shortly.', data: { id: result.lastInsertRowid } });
});

// GET /api/appointments
router.get('/', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT a.*, d.name as department_name, doc.name as doctor_name FROM appointments a JOIN departments d ON a.department_id = d.id JOIN doctors doc ON a.doctor_id = doc.id';
  const params = [];
  if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) { query += ' WHERE a.status = ?'; params.push(status); }
  query += ' ORDER BY a.created_at DESC';
  res.json({ success: true, data: all(query, params) });
});

// PATCH /api/appointments/:id
router.patch('/:id', (req, res) => {
  const { status } = req.body;
  if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) return res.status(400).json({ success: false, error: 'Invalid status' });
  const existing = get('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ success: false, error: 'Appointment not found' });
  run('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ success: true, message: `Appointment ${status} successfully` });
});

module.exports = router;
