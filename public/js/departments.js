document.getElementById('app').innerHTML = `
${renderNavbar('departments')}
<div class="page-header">
  <h1>Our Departments</h1>
  <p>8 specialized departments with expert doctors and cutting-edge facilities.</p>
  <div class="breadcrumb"><a href="/">Home</a><span>${getIcon('chevron-right')}</span><span>Departments</span></div>
</div>
<section class="section">
  <div class="container">
    <div class="card-grid" id="deptGrid"><div class="spinner"></div></div>
  </div>
</section>
${renderFooter()}
`;

api('/departments').then(res => {
  document.getElementById('deptGrid').innerHTML = res.data.map(dept => `
    <div class="card dept-card">
      <div class="card-icon">${getIcon(dept.icon, 28)}</div>
      <h3>${dept.name}</h3>
      <p>${dept.description}</p>
      <div style="margin-top:12px;color:var(--text-light);font-size:0.875rem">${getIcon('users', 16)} ${dept.doctor_count} Doctor${dept.doctor_count !== 1 ? 's' : ''}</div>
    </div>
  `).join('');
}).catch(() => { document.getElementById('deptGrid').innerHTML = '<p>Failed to load departments.</p>'; });

document.addEventListener('DOMContentLoaded', () => updateNavAuth());
