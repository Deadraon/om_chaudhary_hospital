let currentTab = 'appointments';

async function loadDashboard() {
  const stats = await api('/stats');
  const s = stats.data;

  document.getElementById('app').innerHTML = `
  ${renderNavbar('admin')}
  <div class="page-header">
    <h1>Admin Dashboard</h1>
    <p>Manage appointments, messages, and hospital operations.</p>
  </div>
  <section class="section" style="padding-top:40px">
    <div class="container">
      <div class="admin-stats">
        <div class="admin-stat-card"><h3>${s.totalDoctors}</h3><p>Doctors</p></div>
        <div class="admin-stat-card warning"><h3>${s.pendingAppointments}</h3><p>Pending Appointments</p></div>
        <div class="admin-stat-card success"><h3>${s.confirmedAppointments}</h3><p>Confirmed</p></div>
        <div class="admin-stat-card danger"><h3>${s.unreadMessages}</h3><p>Unread Messages</p></div>
      </div>

      <div class="admin-tabs">
        <button class="admin-tab ${currentTab === 'appointments' ? 'active' : ''}" onclick="switchTab('appointments')">Appointments (${s.totalAppointments})</button>
        <button class="admin-tab ${currentTab === 'messages' ? 'active' : ''}" onclick="switchTab('messages')">Messages (${s.totalMessages})</button>
      </div>

      <div class="card" style="overflow-x:auto" id="tableContainer"><div class="spinner"></div></div>
    </div>
  </section>
  ${renderFooter()}
  `;

  loadTabData();
}

async function loadTabData() {
  const container = document.getElementById('tableContainer');
  container.innerHTML = '<div class="spinner"></div>';

  if (currentTab === 'appointments') {
    const res = await api('/appointments');
    if (res.data.length === 0) { container.innerHTML = '<p style="padding:24px;text-align:center;color:var(--text-light)">No appointments yet.</p>'; return; }
    container.innerHTML = `<table class="data-table">
      <thead><tr><th>Patient</th><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${res.data.map(a => `<tr>
        <td><strong>${a.patient_name}</strong><br><small style="color:var(--text-light)">${a.patient_email}</small></td>
        <td>${a.doctor_name}</td>
        <td>${a.department_name}</td>
        <td>${a.appointment_date}</td>
        <td>${a.appointment_time}</td>
        <td><span class="status-badge ${a.status}">${a.status}</span></td>
        <td><div class="table-actions">
          ${a.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="updateStatus(${a.id},'confirmed')">Confirm</button><button class="btn btn-sm btn-danger" onclick="updateStatus(${a.id},'cancelled')">Cancel</button>` : '—'}
        </div></td>
      </tr>`).join('')}</tbody></table>`;
  } else {
    const res = await api('/contact');
    if (res.data.length === 0) { container.innerHTML = '<p style="padding:24px;text-align:center;color:var(--text-light)">No messages yet.</p>'; return; }
    container.innerHTML = `<table class="data-table">
      <thead><tr><th>Name</th><th>Subject</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${res.data.map(m => `<tr style="${m.is_read ? '' : 'background:rgba(14,116,144,0.03)'}">
        <td><strong>${m.name}</strong><br><small style="color:var(--text-light)">${m.email}</small></td>
        <td>${m.subject}</td>
        <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.message}</td>
        <td>${new Date(m.created_at).toLocaleDateString()}</td>
        <td><span class="status-badge ${m.is_read ? 'confirmed' : 'pending'}">${m.is_read ? 'Read' : 'Unread'}</span></td>
        <td>${!m.is_read ? `<button class="btn btn-sm btn-secondary" onclick="markRead(${m.id})">Mark Read</button>` : '—'}</td>
      </tr>`).join('')}</tbody></table>`;
  }
}

function switchTab(tab) { currentTab = tab; loadDashboard(); }

async function updateStatus(id, status) {
  try { await api(`/appointments/${id}`, { method: 'PATCH', body: { status } }); showToast(`Appointment ${status}`); loadDashboard(); }
  catch (err) { showToast(err.message, 'error'); }
}

async function markRead(id) {
  try { await api(`/contact/${id}/read`, { method: 'PATCH' }); showToast('Marked as read'); loadDashboard(); }
  catch (err) { showToast(err.message, 'error'); }
}

loadDashboard();
