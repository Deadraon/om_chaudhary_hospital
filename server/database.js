const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'hospital.db');

let db;

async function initDatabase() {
  const SQL = await initSqlJs();

  // Load existing database or create new
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      icon TEXT DEFAULT 'activity',
      image_url TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      specialization TEXT NOT NULL,
      department_id INTEGER NOT NULL,
      qualification TEXT NOT NULL,
      experience_years INTEGER DEFAULT 0,
      bio TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      available_days TEXT DEFAULT 'Mon,Tue,Wed,Thu,Fri',
      consultation_fee INTEGER DEFAULT 500,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      role TEXT DEFAULT 'patient',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try { db.run(`ALTER TABLE appointments ADD COLUMN user_id INTEGER`); } catch (e) { }

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      patient_email TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      department_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed data
  const result = db.exec('SELECT COUNT(*) as count FROM departments');
  const count = result[0].values[0][0];

  if (count === 0) {
    console.log('🌱 Seeding database...');

    const departments = [
      ['Cardiology', 'cardiology', 'Comprehensive heart care including diagnostics, interventional procedures, and cardiac rehabilitation. Our team of experienced cardiologists uses cutting-edge technology to treat all cardiovascular conditions.', 'heart-pulse'],
      ['Neurology', 'neurology', 'Expert diagnosis and treatment of disorders affecting the brain, spinal cord, and nervous system. From headaches to complex neurological conditions, our specialists provide compassionate care.', 'brain'],
      ['Orthopedics', 'orthopedics', 'Complete musculoskeletal care including joint replacement, sports medicine, spine surgery, and trauma care. We help you get back to an active lifestyle.', 'bone'],
      ['Pediatrics', 'pediatrics', 'Dedicated healthcare for infants, children, and adolescents. Our child-friendly environment and experienced pediatricians ensure the best care for your little ones.', 'baby'],
      ['Dermatology', 'dermatology', 'Advanced skin care solutions including treatment for acne, eczema, psoriasis, and cosmetic dermatology. We combine medical expertise with aesthetic excellence.', 'scan-face'],
      ['Ophthalmology', 'ophthalmology', 'State-of-the-art eye care services including cataract surgery, LASIK, glaucoma management, and retinal treatments. Protecting your vision is our priority.', 'eye'],
      ['Gynecology', 'gynecology', 'Comprehensive women\'s health services from routine check-ups to complex surgical procedures. Our team provides sensitive, expert care at every stage of life.', 'heart-handshake'],
      ['Emergency Medicine', 'emergency-medicine', '24/7 emergency medical services with rapid response teams and fully equipped trauma center. We are always ready when you need us most.', 'siren'],
    ];

    for (const [name, slug, desc, icon] of departments) {
      db.run('INSERT INTO departments (name, slug, description, icon) VALUES (?, ?, ?, ?)', [name, slug, desc, icon]);
    }

    const doctors = [
      ['Dr. Arjun Mehta', 'dr-arjun-mehta', 'Interventional Cardiology', 1, 'MBBS, MD (Cardiology), DM', 18, 'Renowned interventional cardiologist with expertise in complex angioplasty.', 'Mon,Tue,Wed,Thu,Fri', 1200],
      ['Dr. Priya Sharma', 'dr-priya-sharma', 'Clinical Cardiology', 1, 'MBBS, DNB (Cardiology)', 12, 'Specializes in preventive cardiology and heart failure management.', 'Mon,Wed,Fri', 1000],
      ['Dr. Rajesh Kumar', 'dr-rajesh-kumar', 'Neurologist', 2, 'MBBS, MD, DM (Neurology)', 20, 'Leading neurologist specializing in stroke management and epilepsy.', 'Mon,Tue,Thu,Fri', 1500],
      ['Dr. Sneha Patel', 'dr-sneha-patel', 'Neuro-Surgeon', 2, 'MBBS, MS, MCh (Neurosurgery)', 15, 'Performs complex brain and spine surgeries with exceptional precision.', 'Tue,Wed,Thu', 1800],
      ['Dr. Vikram Singh', 'dr-vikram-singh', 'Joint Replacement', 3, 'MBBS, MS (Ortho), Fellowship', 16, 'Expert in knee and hip replacement with 2000+ successful procedures.', 'Mon,Tue,Wed,Thu,Fri', 1200],
      ['Dr. Ananya Desai', 'dr-ananya-desai', 'Sports Medicine', 3, 'MBBS, DNB (Ortho)', 10, 'Specializes in sports injuries and arthroscopic surgeries.', 'Mon,Wed,Fri,Sat', 900],
      ['Dr. Kavita Joshi', 'dr-kavita-joshi', 'Pediatrician', 4, 'MBBS, MD (Pediatrics)', 14, 'Compassionate pediatrician known for gentle approach with children.', 'Mon,Tue,Wed,Thu,Fri,Sat', 800],
      ['Dr. Amit Verma', 'dr-amit-verma', 'Dermatologist', 5, 'MBBS, MD (Dermatology)', 11, 'Offers cutting-edge dermatological treatments including laser therapy.', 'Mon,Tue,Thu,Fri', 1000],
      ['Dr. Neha Agarwal', 'dr-neha-agarwal', 'Ophthalmologist', 6, 'MBBS, MS (Ophthalmology)', 13, 'Expert in cataract surgery, LASIK, and retinal disorders.', 'Mon,Wed,Thu,Fri,Sat', 900],
      ['Dr. Sunita Rao', 'dr-sunita-rao', 'Gynecologist', 7, 'MBBS, MS (OB-GYN)', 17, 'Comprehensive women\'s healthcare with expertise in high-risk pregnancies.', 'Mon,Tue,Wed,Fri', 1100],
      ['Dr. Sanjay Gupta', 'dr-sanjay-gupta', 'Emergency Physician', 8, 'MBBS, MD (Emergency Medicine)', 9, 'Leads emergency department with expertise in trauma and critical care.', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 800],
    ];

    for (const [name, slug, spec, deptId, qual, exp, bio, days, fee] of doctors) {
      db.run('INSERT INTO doctors (name, slug, specialization, department_id, qualification, experience_years, bio, available_days, consultation_fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, slug, spec, deptId, qual, exp, bio, days, fee]);
    }

    saveDatabase();
    console.log('✅ Database seeded!');
  }

  return db;
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

// Helper functions that mimic better-sqlite3 API
function getDb() { return db; }

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

function get(sql, params = []) {
  const results = all(sql, params);
  return results[0] || null;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
  const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0];
  return { lastInsertRowid: lastId, changes: db.getRowsModified() };
}

module.exports = { initDatabase, getDb, all, get, run, saveDatabase };
