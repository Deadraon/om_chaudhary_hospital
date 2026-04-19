document.getElementById('app').innerHTML = `
${renderNavbar('appointment')}
<div class="page-header">
  <h1>Book an Appointment</h1>
  <p>Schedule your visit with our expert doctors in just a few clicks.</p>
  <div class="breadcrumb"><a href="/">Home</a><span>${getIcon('chevron-right')}</span><span>Appointment</span></div>
</div>
<section class="section">
  <div class="container" style="max-width:720px">
    <div class="contact-form">
      <form id="appointmentForm">
        <div class="form-row">
          <div class="form-group"><label for="patient_name">Full Name *</label><input type="text" id="patient_name" required placeholder="Your full name"></div>
          <div class="form-group"><label for="patient_email">Email Address *</label><input type="email" id="patient_email" required placeholder="your@email.com"></div>
        </div>
        <div class="form-group"><label for="patient_phone">Phone Number *</label><input type="tel" id="patient_phone" required placeholder="+91 98765 43210"></div>
        <div class="form-row">
          <div class="form-group"><label for="department_id">Department *</label><select id="department_id" required><option value="">Select Department</option></select></div>
          <div class="form-group"><label for="doctor_id">Doctor *</label><select id="doctor_id" required><option value="">Select Doctor</option></select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="appointment_date">Preferred Date *</label><input type="date" id="appointment_date" required></div>
          <div class="form-group"><label for="appointment_time">Preferred Time *</label><select id="appointment_time" required><option value="">Select Time</option>
            ${['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM'].map(t => `<option value="${t}">${t}</option>`).join('')}
          </select></div>
        </div>
        <div class="form-group"><label for="message">Additional Message</label><textarea id="message" rows="3" placeholder="Describe your symptoms or any special requirements..."></textarea></div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Book Appointment ${getIcon('arrow-right', 18)}</button>
      </form>
    </div>
  </div>
</section>
${renderFooter()}
`;

// Set minimum date to today
document.getElementById('appointment_date').min = new Date().toISOString().split('T')[0];

let departments = [], doctors = [];

api('/departments').then(res => {
  departments = res.data;
  const select = document.getElementById('department_id');
  res.data.forEach(d => { const opt = document.createElement('option'); opt.value = d.id; opt.textContent = d.name; select.appendChild(opt); });
});

document.getElementById('department_id').addEventListener('change', async function() {
  const docSelect = document.getElementById('doctor_id');
  docSelect.innerHTML = '<option value="">Select Doctor</option>';
  if (!this.value) return;
  const dept = departments.find(d => d.id == this.value);
  if (!dept) return;
  const res = await api('/doctors?department=' + dept.slug);
  res.data.forEach(d => { const opt = document.createElement('option'); opt.value = d.id; opt.textContent = `${d.name} — ${d.specialization} (₹${d.consultation_fee})`; docSelect.appendChild(opt); });
});

document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Booking...';
  try {
    const data = {
      patient_name: document.getElementById('patient_name').value,
      patient_email: document.getElementById('patient_email').value,
      patient_phone: document.getElementById('patient_phone').value,
      department_id: parseInt(document.getElementById('department_id').value),
      doctor_id: parseInt(document.getElementById('doctor_id').value),
      appointment_date: document.getElementById('appointment_date').value,
      appointment_time: document.getElementById('appointment_time').value,
      message: document.getElementById('message').value
    };
    const res = await api('/appointments', { method: 'POST', body: data });
    showToast(res.message);
    this.reset();
  } catch (err) { showToast(err.message, 'error'); }
  finally { btn.disabled = false; btn.innerHTML = `Book Appointment ${getIcon('arrow-right', 18)}`; }
});
