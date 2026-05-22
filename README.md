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

# Create backend/.env and configure required values:
# MONGO_URI=<your_mongodb_connection_string>
# JWT_SECRET=<your_secret>
# PORT=3000

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

1. Push your project to GitHub.
2. In Render dashboard, click New + and select Web Service.
3. Connect your repository and set the Root Directory to backend.
4. Configure service settings:
    - Runtime: Node
    - Build Command: npm install
    - Start Command: npm start
5. Deploy URL:
    - https://group9.onrender.com

### 2. Deploy Frontend (Render Static Site)

1. In Render dashboard, click New + and select Static Site.
2. Connect the same repository and set the Root Directory to frontend.
3. Configure static site settings:
    - Build Command: npm install && npm run build
    - Publish Directory: dist
4. Deploy URL:
    - https://group9-frontend.onrender.com

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
| Player1 | player1@gmail.com | palyer1@1234 |
| Player2 | player2@gmail.com | player2@1234 |

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
| DTO usage in module structure | ✅ |
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

## 👥 Team
- Lai Ho Thanh Hai (s4045378)
- Nguyen Trong Khoa (3979298)
- Tran Le Phi Long (4019570)
- Nguyen Dung Tri (3979077)
