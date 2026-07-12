<div align="center">

<img src="https://img.shields.io/badge/TransitOps-Fleet%20Management%20System-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTIwIDhINEw2IDJoMTJsIDIgNnptMS4wMyA1LjFsLTEuMDMtNUgzLjk5TDMgMTMuMSBWMTloMXYxaDIwdi0xaDFWMTMuMXoiLz48L3N2Zz4=" alt="TransitOps" />

# 🚛 TransitOps — Intelligent Fleet Management System

**An AI-powered, full-stack fleet and logistics management platform built for the modern age.**  
Dispatch smarter. Drive safer. Operate leaner.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)]()
[![Hackathon](https://img.shields.io/badge/Hackathon-Odoo%202026-blueviolet?style=flat-square)]()

<br/>

> 🏆 **Built for the Odoo Hackathon 2026** — Designed to solve real-world fleet logistics challenges with a sleek, role-based, full-stack web application.

<br/>

[🚀 Live Demo](#) • [📖 API Docs](#api-reference) • [🐛 Report Bug](https://github.com/richastech-collab/odoo-hackathon-2026/issues) • [✨ Request Feature](https://github.com/richastech-collab/odoo-hackathon-2026/issues)

</div>

---

## 📸 Preview

> **Landing Page** — Premium claymorphism design with dark/light mode toggle

| Light Mode | Dark Mode |
|---|---|
| *(Screenshot placeholder — add your screenshot here)* | *(Screenshot placeholder — add your screenshot here)* |

> **Dashboard** — Role-based analytics, real-time fleet overview

| Dashboard View | Trips Management |
|---|---|
| *(Screenshot placeholder)* | *(Screenshot placeholder)* |

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [⚙️ How It Works](#️-how-it-works)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [📡 API Reference](#-api-reference)
- [👥 Role-Based Access Control](#-role-based-access-control)
- [🌟 Bonus Features](#-bonus-features)
- [🔭 Future Scope](#-future-scope)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Team](#-team)

---

## 🎯 Project Overview

**TransitOps** is a comprehensive, production-grade **Fleet & Logistics Management System** that helps transport companies streamline their daily operations. From vehicle dispatching and driver monitoring to expense tracking and safety compliance — TransitOps brings everything under one intelligent roof.

### 🔍 The Problem We're Solving

Fleet management today is **fragmented, manual, and error-prone**:
- 📋 Dispatchers use spreadsheets for trip planning
- 💸 Finance teams track fuel costs in separate tools
- 🔧 Maintenance logs are on paper or lost entirely
- 👤 No real-time visibility for managers

### 💡 Our Solution

A **single, unified platform** with:
- Real-time fleet status tracking
- Role-based access for every stakeholder (Manager → Driver → Finance → Safety)
- Automated trip lifecycle management
- Integrated expense and fuel tracking
- Safety compliance monitoring

---

## ✨ Key Features

### 🌐 Landing Page
- **Premium UI** — Glassmorphism / Claymorphism design system
- **Light/Dark Mode** — Persisted theme toggle with smooth transitions
- **Animated Hero Section** — Dynamic fleet statistics counter
- **How It Works Section** — Clean step-by-step user journey
- **Bonus Features Strip** — Highlighting AI, analytics, and compliance tools

### 🔐 Authentication
- JWT-based secure login with Bearer token
- Role detection via `/api/auth/me` endpoint
- Session persistence across page reloads via `sessionStorage`
- Protected routes with role-based navigation guards

### 🚗 Fleet / Vehicles Module
- Add, edit, delete vehicles with full validation
- Track: Registration No., Type, Capacity, Odometer, Acquisition Cost
- Real-time status: `Available | On Trip | In Shop | Retired`

### 👨‍✈️ Driver Management
- Complete driver profiles with license info
- Safety score tracking (0–100)
- License expiry alerts with visual warnings
- Status tracking: `Available | On Trip | Off Duty | Suspended`

### 🗺️ Trip Lifecycle Management
- Create draft trips with vehicle & driver assignment
- Business rule enforcement: cargo weight vs. vehicle capacity check
- One-click status transitions: `Draft → Dispatched → Completed | Cancelled`
- Auto-update vehicle & driver availability on dispatch/completion

### 🔧 Maintenance Logs
- Log service entries with type, date, cost, and description
- Pending/Completed status tracking
- Auto-sets vehicle status to `In Shop` on new maintenance entry
- Restores vehicle to `Available` on completion

### 💰 Financial Operations
- **Fuel Logs** — Track liters, cost-per-liter with auto-calculated total
- **General Expenses** — Categorized operational costs (Tolls, Meals, etc.)
- Tabbed interface for clean financial separation

### 📊 Dashboard & Reports
- Fleet-wide KPI summary
- Trip counts by status (Active, Completed, Cancelled, Draft)
- Real-time MongoDB aggregations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         TRANSITOPS                              │
├──────────────────────────┬──────────────────────────────────────┤
│      FRONTEND (React)    │         BACKEND (FastAPI)            │
│                          │                                      │
│  ┌────────────────────┐  │  ┌─────────────────────────────┐    │
│  │  Landing Page      │  │  │  Routers (REST API)         │    │
│  │  (Claymorphism UI) │  │  │  /api/auth   /api/vehicles  │    │
│  └────────────────────┘  │  │  /api/drivers /api/trips    │    │
│  ┌────────────────────┐  │  │  /api/maintenance           │    │
│  │  Dashboard App     │  │  │  /api/expenses /api/reports  │    │
│  │  (Role-based SPA)  │◄─┼──┤  /api/dashboard             │    │
│  └────────────────────┘  │  └──────────────┬──────────────┘    │
│  ┌────────────────────┐  │                 │                    │
│  │  API Client        │──┼──────────────►  │  Motor (AsyncIO)   │
│  │  (Bearer Token)    │  │                 │                    │
│  └────────────────────┘  │  ┌──────────────▼──────────────┐    │
│                          │  │      MongoDB Atlas           │    │
└──────────────────────────┘  │  Collections:               │    │
                              │  users, vehicles, drivers   │    │
                              │  trips, maintenance,        │    │
                              │  expenses                   │    │
                              └─────────────────────────────┘    │
                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ How It Works

> 📷 **Workflow Diagram** *(Add your workflow image here)*


<img src="<img width="11009" height="12093" alt="image" src="https://github.com/user-attachments/assets/125a9213-e3a3-4b61-864e-6145b6723523" />
" alt="TransitOps" />



### Step-by-Step Flow

```
1. 🌐 User visits TransitOps Landing Page
       ↓
2. 🔐 Logs in with role-based credentials (Manager/Driver/Safety/Finance)
       ↓
3. 🏠 Redirected to Role-Specific Dashboard
       ↓
4. 🚗 Fleet Manager adds vehicles & onboards drivers
       ↓
5. 🗺️ Creates trip: assigns vehicle + driver, sets route & cargo weight
       ↓
6. ✅ System validates: capacity check, driver availability, vehicle status
       ↓
7. 🚀 Dispatches trip → Vehicle/Driver status auto-updates to "On Trip"
       ↓
8. ✔️ Marks trip complete → Resources freed back to "Available"
       ↓
9. 🔧 Maintenance logs vehicle downtime → Safety officer tracks compliance
       ↓
10. 💸 Finance team logs fuel/expenses → Reports generated automatically
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|---|---|---|
| **React** | UI Framework | 18+ |
| **Vite** | Build Tool | 5+ |
| **React Router DOM** | Client-side Routing | 6+ |
| **Vanilla CSS** | Styling (Claymorphism) | — |
| **CSS Custom Properties** | Theme System (Dark/Light) | — |

### Backend
| Technology | Purpose | Version |
|---|---|---|
| **FastAPI** | REST API Framework | 0.110+ |
| **Motor** | Async MongoDB Driver | 3.7+ |
| **PyJWT** | JWT Authentication | 2.8+ |
| **Pydantic** | Data Validation | 2.x |
| **bcrypt** | Password Hashing | 4.x |
| **python-jose** | JWT Cryptography | 3.x |
| **uvicorn** | ASGI Server | 0.28+ |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud NoSQL Database |
| **Motor (AsyncIO)** | Non-blocking DB queries |
| **GitHub** | Version Control |

---

## 📁 Project Structure

```
odoo-hackathon-2026/
│
├── 📂 Frontend/
│   ├── 📂 src/
│   │   ├── 📂 api/
│   │   │   └── client.js              # API client with auth token injection
│   │   ├── 📂 app/
│   │   │   ├── 📂 components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── AppLayout.jsx   # Dashboard shell with sidebar
│   │   │   │   │   └── Header.jsx      # App header with user info
│   │   │   │   └── ui/
│   │   │   │       ├── DataTable.jsx   # Sortable, searchable table
│   │   │   │       ├── ModalDialog.jsx # Reusable modal
│   │   │   │       ├── Button.jsx      # Button variants
│   │   │   │       ├── Input.jsx       # Form input with validation
│   │   │   │       ├── Badge.jsx       # Status badges
│   │   │   │       └── SelectDropdown.jsx
│   │   │   ├── 📂 context/
│   │   │   │   └── AuthContext.jsx     # JWT auth state management
│   │   │   ├── 📂 pages/
│   │   │   │   ├── VehiclesPage.jsx    # Fleet CRUD
│   │   │   │   ├── DriversPage.jsx     # Driver management
│   │   │   │   ├── TripsPage.jsx       # Trip lifecycle
│   │   │   │   ├── MaintenancePage.jsx # Service logs
│   │   │   │   ├── FinancePage.jsx     # Fuel & expenses
│   │   │   │   ├── DashboardPage.jsx   # Analytics overview
│   │   │   │   └── LoginPage.jsx       # Auth page
│   │   │   └── 📂 router/
│   │   │       └── AppRouter.jsx       # Protected routes
│   │   ├── 📂 components/             # Landing page components
│   │   │   ├── Navbar.jsx             # Responsive navbar + dark toggle
│   │   │   ├── Hero.jsx               # Animated hero section
│   │   │   ├── Features.jsx           # Feature cards
│   │   │   ├── HowItWorks.jsx         # Step-by-step guide
│   │   │   ├── DashboardMockup.jsx    # Interactive UI preview
│   │   │   └── BonusStrip.jsx         # Bonus features banner
│   │   ├── App.jsx                     # Root component + theme provider
│   │   └── index.css                   # Global CSS design system
│   ├── index.html
│   └── package.json
│
├── 📂 Backend/
│   ├── 📂 routers/
│   │   ├── auth.py                    # Register, Login, /me
│   │   ├── vehicles.py                # CRUD + full validation
│   │   ├── drivers.py                 # CRUD + license validation
│   │   ├── expenses.py                # Fuel & general expense logs
│   │   └── maintenance.py             # Service log management
│   ├── 📂 app/
│   │   ├── 📂 routes/
│   │   │   ├── trips.py               # Trip lifecycle + status transitions
│   │   │   ├── dashboard.py           # KPI aggregations
│   │   │   └── reports.py             # Summary reports
│   │   └── 📂 schemas/
│   │       └── trip_schema.py         # Trip Pydantic model
│   ├── 📂 models/
│   │   ├── vehicles.py                # Vehicle Pydantic schema
│   │   ├── drivers.py                 # Driver Pydantic schema
│   │   ├── expenses.py                # Expense Pydantic schema
│   │   └── maintenance.py             # Maintenance Pydantic schema
│   ├── main.py                        # FastAPI app entry point
│   ├── database.py                    # Motor async MongoDB connection
│   ├── security.py                    # JWT + bcrypt + RBAC
│   ├── config.py                      # Pydantic settings
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- **Python** 3.11+
- **MongoDB Atlas** account (free tier works)
- **Git**

---

### 📦 Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/richastech-collab/odoo-hackathon-2026.git
cd odoo-hackathon-2026/Backend

# 2. Create a virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your .env file (see Environment Variables section)
cp .env.example .env
# Edit .env with your MongoDB URI and secret key

# 5. Start the development server
python -m uvicorn main:app --reload --port 8000
```

✅ Backend API is now running at: `http://127.0.0.1:8000`  
📖 Interactive API Docs: `http://127.0.0.1:8000/docs`

---

### 💻 Frontend Setup

```bash
# Navigate to Frontend directory
cd ../Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend is now running at: `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true
DATABASE_NAME=transitops

# JWT Security
SECRET_KEY=your-super-secret-key-change-in-production-minimum-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

> ⚠️ **Never commit your `.env` file.** It's already listed in `.gitignore`.

---

## 📡 API Reference

### 🔐 Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |

### 🚗 Vehicles

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/vehicles` | List all vehicles | ✅ |
| `POST` | `/api/vehicles` | Add new vehicle | ✅ Admin/Manager |
| `PUT` | `/api/vehicles/{id}` | Update vehicle | ✅ Admin/Manager |
| `DELETE` | `/api/vehicles/{id}` | Delete vehicle | ✅ Admin/Manager |

### 👨‍✈️ Drivers

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/drivers` | List all drivers | ✅ |
| `POST` | `/api/drivers` | Add new driver | ✅ |
| `PUT` | `/api/drivers/{id}` | Update driver | ✅ |
| `DELETE` | `/api/drivers/{id}` | Delete driver | ✅ |

### 🗺️ Trips

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/trips` | List all trips | ✅ |
| `POST` | `/api/trips` | Create new draft trip | ✅ |
| `POST` | `/api/trips/{id}/dispatch` | Dispatch trip | ✅ |
| `POST` | `/api/trips/{id}/complete` | Mark trip complete | ✅ |
| `POST` | `/api/trips/{id}/cancel` | Cancel a trip | ✅ |

### 🔧 Maintenance

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/maintenance` | List all service logs | ✅ |
| `POST` | `/api/maintenance` | Log new maintenance | ✅ |
| `PUT` | `/api/maintenance/{id}` | Update service log | ✅ |
| `DELETE` | `/api/maintenance/{id}` | Delete service log | ✅ |

### 💸 Expenses

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/expenses` | List all expenses | ✅ |
| `POST` | `/api/expenses` | Log new expense | ✅ |
| `PUT` | `/api/expenses/{id}` | Update expense | ✅ |
| `DELETE` | `/api/expenses/{id}` | Delete expense | ✅ |

### 📊 Dashboard & Reports

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/dashboard` | KPI summary | ✅ |
| `GET` | `/api/reports` | Detailed report | ✅ |

---

## 👥 Role-Based Access Control

TransitOps implements a strict, 4-tier RBAC system:

| Role | Dashboard | Vehicles | Drivers | Trips | Maintenance | Finance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 👑 **Fleet Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 🚛 **Driver** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| 🛡️ **Safety Officer** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| 💰 **Financial Analyst** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🌟 Bonus Features

| Feature | Description |
|---|---|
| 🌙 **Dark / Light Mode** | System-wide theme with `localStorage` persistence |
| 🎨 **Claymorphism UI** | Premium, modern design system with glassmorphism cards |
| ✅ **Business Rule Validation** | Cargo weight checked against vehicle capacity on trip creation |
| 🔄 **Auto Status Sync** | Dispatching a trip auto-marks vehicle + driver as "On Trip" |
| 🛡️ **Safety Score Tracking** | Color-coded driver safety scores with expiry alerts |
| ⚡ **Auto Fuel Calculations** | Total fuel cost auto-calculates from liters × cost-per-liter |
| 📱 **Responsive Design** | Fully functional on mobile and tablet |
| 🔍 **Live Search & Sort** | All data tables support real-time search and column sorting |

---

## 🔭 Future Scope

- 📍 **GPS Live Tracking** — Real-time vehicle location on interactive maps
- 🤖 **AI Trip Optimizer** — Smart route and vehicle recommendations
- 📲 **Mobile App** — React Native driver companion app
- 📊 **Advanced Analytics** — Charts, cost trends, and fuel efficiency graphs
- 🔔 **Push Notifications** — Driver alerts, maintenance reminders
- 🌍 **Multi-Tenant SaaS** — Support multiple fleet companies on one platform
- 📄 **PDF Reports** — Exportable financial and operational reports
- 🔌 **Odoo Integration** — Native sync with Odoo ERP modules

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'feat: Add AmazingFeature'

# 4. Push to your branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation update
- `style:` — UI/styling changes
- `refactor:` — Code refactoring
- `test:` — Adding tests

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License — Copyright (c) 2026 RichasTech Collab
```

---

## 👨‍💻 Team

<div align="center">

Built with ❤️ for the **Odoo Hackathon 2026**

| Role | Name | GitHub |
|---|---|---|
| 👑 **Team Leader** | Richa Singh | [@richa](https://github.com/richastech-collab) |
| 💻 **Developer** | Ankit | [@ankit](https://github.com/) |
| 🎨 **Developer** | Neha | [@neha](https://github.com/) |
| 🔧 **Developer** | Azhan | [@azhan](https://github.com/) |

<br/>

*"We didn't just build a product — we built the future of fleet management."*

<br/>

⭐ **If you found this project helpful, give it a star!** ⭐

[![Star on GitHub](https://img.shields.io/github/stars/richastech-collab/odoo-hackathon-2026?style=social)](https://github.com/richastech-collab/odoo-hackathon-2026)

</div>

