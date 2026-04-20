/* ═══════════════════════════════════════
   Shared Utilities & Navigation
   ═══════════════════════════════════════ */

const API_BASE = '';

// ─── API Helper ─────────────────────────
async function api(endpoint, options = {}) {
  const url = `${API_BASE}/api${endpoint}`;
  const config = { headers: { 'Content-Type': 'application/json' }, ...options };
  if (config.body && typeof config.body === 'object') config.body = JSON.stringify(config.body);
  const res = await fetch(url, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

// ─── Toast Notifications ────────────────
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ─── Lucide Icons ───────────────────────
function getIcon(name, size = 24) {
  const icons = {
    'heart-pulse': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
    'brain': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/><path d="M6.5 9h11"/></svg>`,
    'bone': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.3 5.7a2.5 2.5 0 1 1 0-3.5L20 3.9a2.5 2.5 0 1 1-3.5 0"/><path d="m5.7 18.3-1.7 1.7a2.5 2.5 0 1 1 0-3.5L5.7 18a2.5 2.5 0 1 1-3.5 0"/><path d="M18.3 5.7 5.7 18.3"/></svg>`,
    'baby': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>`,
    'scan-face': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>`,
    'eye': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`,
    'heart-handshake': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>`,
    'siren': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1"/><path d="M12 7V3"/><path d="M5.45 11.13 3 9.5"/><path d="M18.55 11.13 21 9.5"/></svg>`,
    'activity': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>`,
    'phone': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    'mail': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    'map-pin': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
    'clock': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    'star': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    'arrow-right': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    'chevron-right': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    'shield': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    'users': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    'award': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>`,
    'stethoscope': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/></svg>`,
    'menu': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
    'x': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    'hospital': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/></svg>`,
    'target': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    'calendar': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  };
  return icons[name] || icons['activity'];
}

// ─── Navbar Component ───────────────────
function renderNavbar(activePage = '') {
  const currentPage = activePage || window.location.pathname.replace('/', '').replace('.html', '') || 'home';
  return `
  <nav class="navbar" id="navbar">
    <div class="container">
      <a href="/" class="nav-logo">
        ${getIcon('hospital', 36)}
        <span>Om Chaudhary Hospital</span>
      </a>
      <div class="nav-links" id="navLinks">
        <a href="/" class="${currentPage === 'home' ? 'active' : ''}">Home</a>
        <a href="/about" class="${currentPage === 'about' ? 'active' : ''}">About</a>
        <a href="/departments" class="${currentPage === 'departments' ? 'active' : ''}">Departments</a>
        <a href="/doctors" class="${currentPage === 'doctors' ? 'active' : ''}">Doctors</a>
        <a href="/contact" class="${currentPage === 'contact' ? 'active' : ''}">Contact</a>
        <a href="/appointment" class="nav-cta">Book Appointment</a>
        <button class="nav-login-btn" id="navLoginBtn" onclick="openAuthModal()">Login</button>
      </div>
      <button class="nav-toggle" id="navToggle" onclick="toggleNav()">${getIcon('menu')}</button>
    </div>
  </nav>

  <div id="authModalOverlay" onclick="handleOverlayClick(event)" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:20px;">
    <div style="background:white;border-radius:20px;padding:40px;width:100%;max-width:420px;position:relative;box-shadow:0 25px 50px rgba(0,0,0,0.25);">
      <button onclick="closeAuthModal()" style="position:absolute;top:16px;right:16px;border:none;background:#f1f5f9;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:16px;color:#64748b;line-height:1;">✕</button>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
        ${getIcon('hospital', 28)}
        <span style="font-size:17px;font-weight:700;color:#0d4f5c;">Om Chaudhary Hospital</span>
      </div>
      <p style="font-size:13px;color:#64748b;margin-bottom:28px;">Patient Portal — Login or create an account</p>
      <div style="display:flex;background:#f1f5f9;border-radius:10px;padding:4px;margin-bottom:24px;">
        <button id="modalTabLogin" onclick="switchModalTab('login')" style="flex:1;padding:9px;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;background:white;color:#0d4f5c;box-shadow:0 1px 4px rgba(0,0,0,0.1);font-family:inherit;">Login</button>
        <button id="modalTabSignup" onclick="switchModalTab('signup')" style="flex:1;padding:9px;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;background:transparent;color:#64748b;font-family:inherit;">Sign Up</button>
      </div>
      <div id="modalMsg" style="display:none;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;"></div>
      <div id="modalLoginForm">
        <div style="margin-bottom:16px;"><label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:6px;">Email Address</label><input id="modalLoginEmail" type="email" placeholder="your@email.com" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;font-family:inherit;box-sizing:border-box;" /></div>
        <div style="margin-bottom:20px;"><label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:6px;">Password</label><input id="modalLoginPassword" type="password" placeholder="••••••••" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;font-family:inherit;box-sizing:border-box;" /></div>
        <button onclick="handleModalLogin()" id="modalLoginBtn" style="width:100%;padding:13px;background:#0d9488;color:white;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;">Login</button>
      </div>
      <div id="modalSignupForm" style="display:none;">
        <div style="margin-bottom:16px;"><label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:6px;">Full Name</label><input id="modalSignupName" type="text" placeholder="Your full name" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;font-family:inherit;box-sizing:border-box;" /></div>
        <div style="margin-bottom:16px;"><label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:6px;">Email Address</label><input id="modalSignupEmail" type="email" placeholder="your@email.com" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;font-family:inherit;box-sizing:border-box;" /></div>
        <div style="margin-bottom:16px;"><label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:6px;">Phone Number</label><input id="modalSignupPhone" type="tel" placeholder="+91 98765 43210" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;font-family:inherit;box-sizing:border-box;" /></div>
        <div style="margin-bottom:20px;"><label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:6px;">Password</label><input id="modalSignupPassword" type="password" placeholder="Min 6 characters" style="width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;font-family:inherit;box-sizing:border-box;" /></div>
        <button onclick="handleModalSignup()" id="modalSignupBtn" style="width:100%;padding:13px;background:#0d9488;color:white;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;">Create Account</button>
      </div>
    </div>
  </div>`;
}

function openAuthModal() {
  const overlay = document.getElementById('authModalOverlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const overlay = document.getElementById('authModalOverlay');
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('authModalOverlay')) closeAuthModal();
}

function switchModalTab(tab) {
  const loginTab = document.getElementById('modalTabLogin');
  const signupTab = document.getElementById('modalTabSignup');
  const loginForm = document.getElementById('modalLoginForm');
  const signupForm = document.getElementById('modalSignupForm');
  const msg = document.getElementById('modalMsg');
  msg.style.display = 'none';
  if (tab === 'login') {
    loginTab.style.background = 'white'; loginTab.style.color = '#0d4f5c'; loginTab.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
    signupTab.style.background = 'transparent'; signupTab.style.color = '#64748b'; signupTab.style.boxShadow = 'none';
    loginForm.style.display = 'block'; signupForm.style.display = 'none';
  } else {
    signupTab.style.background = 'white'; signupTab.style.color = '#0d4f5c'; signupTab.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
    loginTab.style.background = 'transparent'; loginTab.style.color = '#64748b'; loginTab.style.boxShadow = 'none';
    signupForm.style.display = 'block'; loginForm.style.display = 'none';
  }
}

function showModalMsg(msg, type) {
  const el = document.getElementById('modalMsg');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = type === 'error' ? '#fef2f2' : '#f0fdf4';
  el.style.color = type === 'error' ? '#dc2626' : '#16a34a';
}

async function handleModalLogin() {
  const btn = document.getElementById('modalLoginBtn');
  btn.disabled = true; btn.textContent = 'Logging in...';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: document.getElementById('modalLoginEmail').value, password: document.getElementById('modalLoginPassword').value })
    });
    const data = await res.json();
    if (data.success) {
      showModalMsg('Login successful! Redirecting...', 'success');
      setTimeout(() => { window.location.href = data.role === 'admin' ? '/admin' : '/dashboard'; }, 1000);
    } else { showModalMsg(data.message || 'Invalid email or password', 'error'); }
  } catch(e) { showModalMsg('Something went wrong. Please try again.', 'error'); }
  finally { btn.disabled = false; btn.textContent = 'Login'; }
}

async function handleModalSignup() {
  const btn = document.getElementById('modalSignupBtn');
  btn.disabled = true; btn.textContent = 'Creating account...';
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('modalSignupName').value,
        email: document.getElementById('modalSignupEmail').value,
        phone: document.getElementById('modalSignupPhone').value,
        password: document.getElementById('modalSignupPassword').value
      })
    });
    const data = await res.json();
    if (data.success) {
      showModalMsg('Account created! Redirecting...', 'success');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    } else { showModalMsg(data.message || 'Signup failed', 'error'); }
  } catch(e) { showModalMsg('Something went wrong. Please try again.', 'error'); }
  finally { btn.disabled = false; btn.textContent = 'Create Account'; }
}

function toggleNav() {
  const links = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle');
  links.classList.toggle('open');
  toggle.innerHTML = links.classList.contains('open') ? getIcon('x') : getIcon('menu');
}

// ─── Footer Component ──────────────────
function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">${getIcon('hospital', 28)} Om Chaudhary Hospital</div>
          <p>Providing compassionate, world-class healthcare with cutting-edge technology and experienced specialists since 2005.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/departments">Departments</a></li>
            <li><a href="/doctors">Our Doctors</a></li>
            <li><a href="/appointment">Book Appointment</a></li>
          </ul>
        </div>
        <div>
          <h4>Departments</h4>
          <ul>
            <li><a href="/departments">Cardiology</a></li>
            <li><a href="/departments">Neurology</a></li>
            <li><a href="/departments">Orthopedics</a></li>
            <li><a href="/departments">Pediatrics</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Info</h4>
          <ul>
            <li>${getIcon('phone', 16)} +91 98765 43210</li>
            <li>${getIcon('mail', 16)} info@omchaudhary.com</li>
            <li>${getIcon('map-pin', 16)} 42 Health Avenue, Delhi</li>
            <li>${getIcon('clock', 16)} 24/7 Emergency</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Om Chaudhary Hospital. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
}

// ─── Scroll Effects ─────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── Init Doctor Avatar ─────────────────
function getInitials(name) {
  return name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2);
}

// ─── Auth Nav Update ─────────────────────
async function updateNavAuth() {
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    const btn = document.getElementById('navLoginBtn');
    if (!btn) return;
    if (data.success && data.user) {
      if (data.user.role === 'admin') {
        btn.outerHTML = `<a href="/dashboard" class="nav-login-btn">My Account</a><a href="/admin" class="nav-admin-btn">Admin</a><button class="nav-logout-btn" onclick="logoutUser()">Logout</button>`;
      } else {
        btn.outerHTML = `<a href="/dashboard" class="nav-user-btn">${data.user.name.split(' ')[0]}</a><button class="nav-logout-btn" onclick="logoutUser()">Logout</button>`;
      }
    }
  } catch(e) {}
}

async function logoutUser() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
}
