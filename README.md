# TicTacToang 🎮
**Online TicTacToe Gaming Platform** - COSC2769/2808 Full Stack Development

A high-performance web platform for advanced TicTacToe gameplay with local, AI, and real-time online multiplayer.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm.cmd install
npm.cmd run dev
# Backend runs on http://localhost:3000 by default
```

### 2. Frontend Setup
```bash
cd frontend
npm.cmd install
npm.cmd run dev
# Frontend runs on http://localhost:5173
```

---

## ☁️ Deploy on Render

### 1. Deploy Backend (Render Web Service)
 Deploy URL: https://group9.onrender.com

### 2. Deploy Frontend (Render Static Site)
- Deploy URL: https://group9-frontend.onrender.com

### 3. Connect Frontend and Backend

1. Update backend CORS allowlist to include your frontend Render domain.
2. Set backend CLIENT_URL to your frontend Render URL.
3. Set frontend API base URL to your backend Render URL.
4. Redeploy both services after any environment variable change.

### 4. Optional: Enable Auto Deploy

- In both Render services, keep Auto-Deploy enabled for your main branch so each push triggers a new deployment.
- Use Preview Environments if you want per-branch deployment testing.

---

## 🧪 Demo Accounts

Demo account data can be added based on your seeded dataset or manual test users.

| Username | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admin@1234|
| Player1(premium) | player1@gmail.com | Palyer1@1234 |
| Player2 | player2@gmail.com | Payer2@1234 |

---

## 🏗️ Architecture

### Backend - Modular Monolith (N-Tier per module)
```text
backend/src/
├── index.js                     # Entrypoint (imports server)
├── server.js                    # HTTP + Socket.IO bootstrap
├── app.js                       # Express app and route registration
├── config/
│   └── db.js                    # MongoDB connection
├── middlewares/                 # Auth and upload middleware
├── shared/
│   ├── errors/                  # AppError and error primitives
│   ├── security/                # Login attempts, token blacklist
│   └── utils/                   # Shared validators and helpers
├── socket/
│   ├── index.js                 # Socket.IO initialization
│   └── handlers/                # Multiplayer socket handlers
└── modules/
    ├── auth/                    # Register, login, session handling
    ├── user/                    # Profile and user account operations
    ├── game/                    # Game engine, AI, game sessions
    ├── multiplayer/             # Online rooms and match coordination
    ├── billing/                 # Subscription and payment workflows
    └── admin/                   # Player and room administration
```
Each module follows: `routes -> controller -> service -> repository -> model -> dto`

### Frontend - Componentized React Structure
```text
frontend/src/
├── app/
│   ├── App.jsx                  # App shell
│   ├── Router.jsx               # Route map
│   └── providers/
│       └── AuthProvider.jsx     # Auth state provider
├── config/
│   ├── api.config.js            # API base configuration
│   └── apiRoutes.js             # Route constants by domain
├── modules/
│   ├── auth/                    # Authentication pages/components/hooks/services
│   ├── home/                    # Landing and mode selection
│   ├── game/                    # Board, turns, move handling
│   ├── multiplayer/             # Room and online match UI
│   ├── profile/                 # Profile and player history
│   ├── payment/                 # Billing and premium UI
│   └── admin/                   # Admin dashboards and controls
├── services/
│   └── api.js                   # Shared API client
└── shared/                      # Reusable UI, constants, and utilities
```

### Security and Authorization
- Uses JSON Web Signature (JWS) tokens for authentication and authorization.
- Supports role-based access control between Player and Admin APIs.
- Includes protections for hashed-password login and brute-force mitigation.

---

## ✅ Requirements Coverage

| Feature | Status |
|---------|--------|
| Registration with validation | ✅ |
| Login + brute-force protection | ✅ |
| JWS auth + secure session flows | ✅ |
| Profile management | ✅ |
| Avatar upload support | ✅ |
| Game history search/filter | ✅ |
| Local 2-player game | ✅ |
| AI Easy / Medium / Hard | ✅ |
| Win detection for advanced board play | ✅ |
| Online multiplayer (WebSocket) | ✅ |
| Real-time multiplayer synchronization | ✅ |
| Board customization (size/style/marker) | ✅ |
| Match replay with algebraic notation | ✅ |
| Premium chat capability | ✅ |
| Admin player management | ✅ |
| Admin room oversight and controls | ✅ |
| N-Tier architecture | ✅ |
| Modular Monolith backend | ✅ |
| Role-based middleware/API access | ✅ |

---

## 🛠️ Tech Stack
- Frontend: React, Vite, Axios, Socket.IO Client, Bootstrap Icons
- Backend: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- Auth and Security: bcryptjs, jsonwebtoken (JWS)
- Payments and Billing: Stripe
- Email: Nodemailer
- Media Upload: Multer, Cloudinary
- Deployment: Render or local environment

---

## 📌 Project Development Requirements
- Methodology: Developed using an iterative approach (SCRUM).
- Version Control: Managed via GitHub project board for task tracking, commitments, and deliverables.

---

## 🔗 GitHub Repository Link

[TicTacToang Repository](https://github.com/RMIT-Full-Stack-Development-2026A/Group9)

---

## 👥 Team

| Full Name | Student ID | GitHub Username | Key Responsibilities | Score |
|-----------|------------|------------------|----------------------|-------|
| Lai Ho Thanh Hai | s4045378 | ThanHai305 | Merge the first sprint; Homepage & Navigation UI (Front-end); Homepage & Navigation UI (Back-end); TicTacToe Game - AI Logic (Back-end); TicTacToe Local Game - Core Mechanics (Back-end); Merge the second sprint; Match Recording for All Game Type (Back-End); Match Replay Interface (Front-end) | 5 |
| Nguyen Trong Khoa | 3979298 | NguyenTrongKhoa595| Design UI/UX using Figma (Authentication UIs + Admin UIs); Design System Architecture; Profile Management & Game History (Front-end); Profile Management & Game History (Back-end); Premium Subscription & Payments (Front-end); Premium Subscription & Payments (Back-end); Online Multiplayer & Real-Time Chat (Front-end); Online Multiplayer & Match Replay (Back-end) | 5 |
| Tran Le Phi Long | 4019570 | APotato4325| Design Database Table Schemas (Data Models); Player Login & Authentication (Front-end); Player Login & Authentication (Back-end); TicTacToe Game - UI (Front-end); Deployment | 5 |
| Nguyen Dung Tri | 3979077 | Knr0k0 | Design Sequence Diagrams; Admin Dashboard (Front-end)-Fetching Game Room List; Admin Dashboard (Back-end)-Fetching Game Room List; Player Registration (Back-end); Player Registration (Front-end); Admin Portal (Back-end)-Fetch User list; Admin Dashboard (Front-end)-Fetching User List | 5 |

## GitHub Contribution Proof

The repository commit history and contribution graph serve as evidence of active, iterative development across all seven sprints. All commits were made under each member's registered GitHub account.

To verify contributions, navigate to:

[https://github.com/RMIT-Full-Stack-Development-2026A/Group9/graphs/contributors](https://github.com/RMIT-Full-Stack-Development-2026A/Group9/graphs/contributors)

> Note: If GitHub usernames do not contain a member's first and last name, refer to the Contribution Table above for the mapping between full name and GitHub username. 
