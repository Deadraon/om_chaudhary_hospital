const express = require('express');
const router = express.Router();
const { all, get } = require('../database');

// GET /api/doctors
router.get('/', (req, res) => {
  const { department, search } = req.query;
  let query = 'SELECT doc.*, d.name as department_name, d.slug as department_slug FROM doctors doc JOIN departments d ON doc.department_id = d.id';
  const params = [];
  const conditions = [];

  if (department) { conditions.push('d.slug = ?'); params.push(department); }
  if (search) { conditions.push('(doc.name LIKE ? OR doc.specialization LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY doc.name';

  res.json({ success: true, data: all(query, params) });
});

// GET /api/doctors/:slug
router.get('/:slug', (req, res) => {
  const doctor = get('SELECT doc.*, d.name as department_name, d.slug as department_slug FROM doctors doc JOIN departments d ON doc.department_id = d.id WHERE doc.slug = ?', [req.params.slug]);
  if (!doctor) return res.status(404).json({ success: false, error: 'Doctor not found' });
  res.json({ success: true, data: doctor });
});

module.exports = router;
