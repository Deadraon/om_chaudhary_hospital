document.getElementById('app').innerHTML = `
${renderNavbar('doctors')}
<div class="page-header">
  <h1>Our Doctors</h1>
  <p>Expert specialists dedicated to providing the highest quality of medical care.</p>
  <div class="breadcrumb"><a href="/">Home</a><span>${getIcon('chevron-right')}</span><span>Doctors</span></div>
</div>
<section class="section">
  <div class="container">
    <div style="display:flex;gap:16px;margin-bottom:32px;flex-wrap:wrap">
      <select id="deptFilter" style="padding:12px 18px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:0.95rem;min-width:200px;background:var(--bg-card)">
        <option value="">All Departments</option>
      </select>
      <input type="text" id="searchInput" placeholder="Search doctors..." style="padding:12px 18px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:0.95rem;flex:1;min-width:200px;background:var(--bg-card)">
    </div>
    <div class="card-grid" id="doctorGrid"><div class="spinner"></div></div>
  </div>
</section>
${renderFooter()}
`;

let allDoctors = [];

async function loadDoctors() {
  const dept = document.getElementById('deptFilter').value;
  const search = document.getElementById('searchInput').value;
  let query = '/doctors?';
  if (dept) query += 'department=' + dept + '&';
  if (search) query += 'search=' + encodeURIComponent(search);
  const res = await api(query);
  allDoctors = res.data;
  renderDoctors(res.data);
}

function renderDoctors(doctors) {
  document.getElementById('doctorGrid').innerHTML = doctors.length === 0 ? '<p style="text-align:center;color:var(--text-light);grid-column:1/-1">No doctors found.</p>' : doctors.map(doc => `
    <div class="card doctor-card">
      <div class="doctor-avatar">${getInitials(doc.name)}</div>
      <h3>${doc.name}</h3>
      <div class="specialization">${doc.specialization}</div>
      <div class="department-tag">${doc.department_name}</div>
      <div class="experience">${doc.experience_years} years experience</div>
      <div style="margin-top:8px;color:var(--text-light);font-size:0.85rem">${doc.qualification}</div>
      <div style="margin-top:12px;font-weight:600;color:var(--primary)">₹${doc.consultation_fee}</div>
    </div>
  `).join('');
}

// Load department filter options
api('/departments').then(res => {
  const select = document.getElementById('deptFilter');
  res.data.forEach(d => { const opt = document.createElement('option'); opt.value = d.slug; opt.textContent = d.name; select.appendChild(opt); });
});

document.getElementById('deptFilter').addEventListener('change', loadDoctors);
document.getElementById('searchInput').addEventListener('input', loadDoctors);
loadDoctors();

document.addEventListener('DOMContentLoaded', () => updateNavAuth());
