# 🏥 Om Chaudhary Hospital — Official Website

A full-stack hospital website with appointment booking, doctor directory, department listings, contact form, and admin dashboard.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
# → Website: http://localhost:3000
# → Admin:   http://localhost:3000/admin
```

For development with auto-reload:
```bash
npm run dev
```

## Features

| Feature | Description |
|:--|:--|
| 🏠 Landing Page | Hero section, animated stats, featured departments & doctors, testimonials |
| ℹ️ About | Hospital story, mission, values |
| 🏥 Departments | 8 medical departments with descriptions |
| 👨‍⚕️ Doctors | 11 specialist profiles with search & filter |
| 📅 Appointments | Online booking with department→doctor cascading selection |
| 📧 Contact | Contact form + hospital info |
| 📊 Admin Dashboard | Manage appointments (confirm/cancel) and messages (mark read) |

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via sql.js — pure JS, no native compilation)
- **Fonts**: Google Fonts (Inter, Playfair Display)
- **Icons**: Inline SVG (Lucide-style)

## API Endpoints

| Method | Endpoint | Description |
|:--|:--|:--|
| GET | `/api/departments` | List all departments |
| GET | `/api/departments/:slug` | Department detail with doctors |
| GET | `/api/doctors` | List doctors (filter: `?department=&search=`) |
| GET | `/api/doctors/:slug` | Doctor profile |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/appointments` | List appointments (admin) |
| PATCH | `/api/appointments/:id` | Update status (admin) |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | List messages (admin) |
| PATCH | `/api/contact/:id/read` | Mark as read (admin) |
| GET | `/api/stats` | Dashboard statistics |

## Project Structure

```
om-chaudhary-hospital/
├── server/
│   ├── index.js                 # Express server
│   ├── database.js              # SQLite setup & seed data
│   ├── routes/
│   │   ├── departments.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   └── contact.js
│   └── middleware/
│       └── errorHandler.js
├── public/
│   ├── index.html               # Home page
│   ├── about.html
│   ├── departments.html
│   ├── doctors.html
│   ├── appointment.html
│   ├── contact.html
│   ├── admin.html
│   ├── css/styles.css           # Design system
│   └── js/
│       ├── main.js              # Shared utilities & components
│       ├── home.js
│       ├── departments.js
│       ├── doctors.js
│       ├── appointment.js
│       ├── contact.js
│       └── admin.js
├── package.json
└── README.md
```

## Seed Data

The database auto-seeds on first run with:
- **8 Departments**: Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, Ophthalmology, Gynecology, Emergency Medicine
- **11 Doctors**: Specialists across all departments with qualifications, experience, and consultation fees

## License

MIT
