document.getElementById('app').innerHTML = `
${renderNavbar('contact')}
<div class="page-header">
  <h1>Contact Us</h1>
  <p>We're here to help. Reach out to us anytime.</p>
  <div class="breadcrumb"><a href="/">Home</a><span>${getIcon('chevron-right')}</span><span>Contact</span></div>
</div>
<section class="section">
  <div class="container">
    <div class="contact-grid">
      <div>
        <h2 style="font-family:var(--font-display);margin-bottom:8px">Get In Touch</h2>
        <p style="color:var(--text-light);margin-bottom:32px">Have a question or need assistance? We'd love to hear from you.</p>
        <div class="contact-info-cards">
          ${[
            ['phone','Phone','Call us anytime','+91 98765 43210'],
            ['mail','Email','Write to us','info@omchaudhary.com'],
            ['map-pin','Address','Visit us','42 Health Avenue, Connaught Place, New Delhi — 110001'],
            ['clock','Working Hours','We are available','Mon–Sat: 8:00 AM – 8:00 PM | Emergency: 24/7']
          ].map(([icon,title,sub,detail]) => `
            <div class="contact-info-card">
              <div class="info-icon">${getIcon(icon, 22)}</div>
              <div><h4>${title}</h4><p>${sub}<br><strong>${detail}</strong></p></div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="contact-form">
        <h3 style="margin-bottom:24px;font-family:var(--font-display)">Send Us a Message</h3>
        <form id="contactForm">
          <div class="form-row">
            <div class="form-group"><label for="name">Name *</label><input type="text" id="name" required placeholder="Your name"></div>
            <div class="form-group"><label for="email">Email *</label><input type="email" id="email" required placeholder="your@email.com"></div>
          </div>
          <div class="form-group"><label for="phone">Phone</label><input type="tel" id="phone" placeholder="+91 98765 43210"></div>
          <div class="form-group"><label for="subject">Subject *</label><input type="text" id="subject" required placeholder="How can we help?"></div>
          <div class="form-group"><label for="contactMessage">Message *</label><textarea id="contactMessage" required rows="4" placeholder="Your message..."></textarea></div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Send Message ${getIcon('arrow-right', 18)}</button>
        </form>
      </div>
    </div>
  </div>
</section>
${renderFooter()}
`;

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const data = { name: document.getElementById('name').value, email: document.getElementById('email').value, phone: document.getElementById('phone').value, subject: document.getElementById('subject').value, message: document.getElementById('contactMessage').value };
    const res = await api('/contact', { method: 'POST', body: data });
    showToast(res.message);
    this.reset();
  } catch (err) { showToast(err.message, 'error'); }
  finally { btn.disabled = false; btn.innerHTML = `Send Message ${getIcon('arrow-right', 18)}`; }
});
