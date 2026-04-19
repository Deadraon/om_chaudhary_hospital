(async () => { document.getElementById('app').innerHTML = await `
${renderNavbar('home')}

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <div class="hero-badge">${getIcon('activity', 16)} Trusted Since 2005</div>
      <h1>Your Health, Our <span class="gradient-text">Priority</span></h1>
      <p>Experience compassionate, world-class healthcare at Om Chaudhary Hospital. Our team of 50+ specialist doctors across 8 departments is dedicated to your well-being with cutting-edge technology and personalized care.</p>
      <div class="hero-buttons">
        <a href="/appointment" class="btn btn-primary">Book Appointment ${getIcon('arrow-right', 18)}</a>
        <a href="/departments" class="btn btn-outline">Explore Departments</a>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="stats-bar" id="statsBar">
      <div class="stat-item"><div class="stat-number" data-count="50">0</div><div class="stat-label">Expert Doctors</div></div>
      <div class="stat-item"><div class="stat-number" data-count="8">0</div><div class="stat-label">Departments</div></div>
      <div class="stat-item"><div class="stat-number" data-count="25000">0</div><div class="stat-label">Happy Patients</div></div>
      <div class="stat-item"><div class="stat-number" data-count="20">0</div><div class="stat-label">Years Experience</div></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <div class="section-badge">Our Departments</div>
      <h2>Comprehensive Medical Care</h2>
      <p>Specialized departments equipped with the latest technology and experienced healthcare professionals.</p>
    </div>
    <div class="card-grid" id="deptGrid"><div class="spinner"></div></div>
  </div>
</section>

<section class="section section-dark">
  <div class="container">
    <div class="section-header">
      <div class="section-badge">Why Choose Us</div>
      <h2>Excellence in Every Aspect</h2>
      <p>We combine medical expertise with compassionate care to provide the best healthcare experience.</p>
    </div>
    <div class="features-grid">
      ${[
        ['shield','Advanced Technology','State-of-the-art medical equipment and diagnostic facilities for precise treatment.'],
        ['users','Expert Team','Board-certified specialists with decades of combined experience across all fields.'],
        ['clock','24/7 Emergency','Round-the-clock emergency services with rapid response trauma teams.'],
        ['award','Accredited Care','Nationally accredited hospital maintaining the highest standards of medical care.'],
        ['stethoscope','Personalized Treatment','Customized care plans tailored to each patient\'s unique needs and conditions.'],
        ['heart-pulse','Patient First','A patient-centered approach ensuring comfort, dignity, and the best outcomes.']
      ].map(([icon, title, desc]) => `
        <div class="feature-item">
          <div class="feature-icon">${getIcon(icon, 22)}</div>
          <div><h4>${title}</h4><p>${desc}</p></div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <div class="section-badge">Our Doctors</div>
      <h2>Meet Our Specialists</h2>
      <p>Skilled, experienced doctors committed to providing the highest quality of medical care.</p>
    </div>
    <div class="card-grid" id="doctorGrid"><div class="spinner"></div></div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <div class="section-badge">Testimonials</div>
      <h2>What Our Patients Say</h2>
      <p>Real stories from patients who have experienced our care and compassion.</p>
    </div>
    <div class="testimonial-grid">
      ${[
        ['Rajesh Khanna','Heart Surgery Patient','The cardiology team at Om Chaudhary Hospital saved my life. The care, attention, and expertise were beyond exceptional. I am forever grateful.','RK'],
        ['Meera Jain','Orthopedic Patient','After my knee replacement surgery, the rehabilitation team was incredible. I am walking pain-free for the first time in years. Highly recommended!','MJ'],
        ['Anil Sharma','Emergency Patient','The emergency team\'s response was lightning fast. From admission to treatment, everything was seamless. Best hospital experience I\'ve ever had.','AS']
      ].map(([name, type, quote, initials]) => `
        <div class="card testimonial-card">
          <div class="stars">${Array(5).fill(getIcon('star', 16)).join('')}</div>
          <blockquote>"${quote}"</blockquote>
          <div class="testimonial-author">
            <div class="testimonial-author-avatar">${initials}</div>
            <div class="testimonial-author-info">
              <strong>${name}</strong>
              <span>${type}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <h2>Ready to Experience World-Class Healthcare?</h2>
    <p>Book your appointment today and take the first step towards better health.</p>
    <a href="/appointment" class="btn">Book Your Appointment ${getIcon('arrow-right', 18)}</a>
  </div>
</section>

${renderFooter()}
`;

// Load departments
api('/departments').then(res => {
  document.getElementById('deptGrid').innerHTML = res.data.slice(0, 4).map(dept => `
    <div class="card dept-card">
      <div class="card-icon">${getIcon(dept.icon, 28)}</div>
      <h3>${dept.name}</h3>
      <p>${dept.description.substring(0, 120)}...</p>
      <a href="/departments" class="card-link">Learn More ${getIcon('chevron-right')}</a>
    </div>
  `).join('');
}).catch(() => { document.getElementById('deptGrid').innerHTML = '<p>Unable to load departments.</p>'; });

// Load doctors
api('/doctors').then(res => {
  document.getElementById('doctorGrid').innerHTML = res.data.slice(0, 4).map(doc => `
    <div class="card doctor-card">
      <div class="doctor-avatar">${getInitials(doc.name)}</div>
      <h3>${doc.name}</h3>
      <div class="specialization">${doc.specialization}</div>
      <div class="department-tag">${doc.department_name}</div>
      <div class="experience">${doc.experience_years} years experience</div>
    </div>
  `).join('');
}).catch(() => { document.getElementById('doctorGrid').innerHTML = '<p>Unable to load doctors.</p>'; });

// Animate stats
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { el.textContent = target.toLocaleString() + '+'; clearInterval(timer); }
          else el.textContent = Math.floor(current).toLocaleString();
        }, 25);
      });
      observer.disconnect();
    }
  });
});
const statsBar = document.getElementById('statsBar');
if (statsBar) observer.observe(statsBar);

document.addEventListener('DOMContentLoaded', () => updateNavAuth());
