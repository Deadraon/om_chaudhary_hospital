const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, all, get } = require('./database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Start server after DB is ready
initDatabase().then(() => {
  // API Routes
  app.use('/api/departments', require('./routes/departments'));
  app.use('/api/doctors', require('./routes/doctors'));
  app.use('/api/appointments', require('./routes/appointments'));
  app.use('/api/contact', require('./routes/contact'));

  // Stats endpoint
  app.get('/api/stats', (req, res) => {
    const totalDoctors = get('SELECT COUNT(*) as count FROM doctors').count;
    const totalDepartments = get('SELECT COUNT(*) as count FROM departments').count;
    const totalAppointments = get('SELECT COUNT(*) as count FROM appointments').count;
    const pendingAppointments = get("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'").count;
    const confirmedAppointments = get("SELECT COUNT(*) as count FROM appointments WHERE status = 'confirmed'").count;
    const unreadMessages = get('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0').count;
    const totalMessages = get('SELECT COUNT(*) as count FROM contact_messages').count;
    const recentAppointments = all('SELECT a.*, d.name as department_name, doc.name as doctor_name FROM appointments a JOIN departments d ON a.department_id = d.id JOIN doctors doc ON a.doctor_id = doc.id ORDER BY a.created_at DESC LIMIT 5');

    res.json({ success: true, data: { totalDoctors, totalDepartments, totalAppointments, pendingAppointments, confirmedAppointments, unreadMessages, totalMessages, recentAppointments } });
  });

  // HTML page routes
  ['about', 'departments', 'doctors', 'appointment', 'contact', 'admin'].forEach(page => {
    app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, '..', 'public', `${page}.html`)));
  });

  app.use('/api/*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║   🏥 Om Chaudhary Hospital Server               ║
  ║                                                  ║
  ║   → Local:  http://localhost:${PORT}               ║
  ║   → Admin:  http://localhost:${PORT}/admin          ║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
    `);
  });
}).catch(err => { console.error('Failed to start:', err); process.exit(1); });

module.exports = app;
