const express = require('express');
const router = express.Router();
const { all, get } = require('../database');

// GET /api/departments
router.get('/', (req, res) => {
  const departments = all(`
    SELECT d.*, COUNT(doc.id) as doctor_count 
    FROM departments d 
    LEFT JOIN doctors doc ON d.id = doc.department_id 
    GROUP BY d.id 
    ORDER BY d.name
  `);
  res.json({ success: true, data: departments });
});

// GET /api/departments/:slug
router.get('/:slug', (req, res) => {
  const department = get('SELECT * FROM departments WHERE slug = ?', [req.params.slug]);
  if (!department) return res.status(404).json({ success: false, error: 'Department not found' });
  const doctors = all('SELECT * FROM doctors WHERE department_id = ? ORDER BY name', [department.id]);
  res.json({ success: true, data: { ...department, doctors } });
});

module.exports = router;
