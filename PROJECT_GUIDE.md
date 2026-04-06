# Group 9 Project Guide

## Overview

This project is a full-stack TicTacToang application with a Node.js/Express backend, a React/Vite frontend, and MongoDB for persistence.

At the current stage, the implemented user-facing flow includes:

- authentication and registration
- profile management with avatar upload (Cloudinary)
- single-player game vs AI (3 difficulty levels)
- local two-player mode
- online multiplayer with real-time moves via WebSocket (Socket.IO)
- in-game chat for online matches
- online lobby (create/join rooms)
- wallet, deposit, premium subscription
- leaderboard with rankings
- admin dashboard (player management, game room management)
- game history viewing, searching, filtering, and sorting

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing
- multer for file uploads
- Cloudinary for avatar storage
- Socket.IO for real-time WebSocket communication
- nodemailer for email notifications

### Frontend

- React
- Vite
- React Router
- Axios
- socket.io-client for real-time communication

## Project Structure

### Backend

- `backend/src/server.js`: application entry point
- `backend/src/app.js`: Express app setup and route mounting
- `backend/src/config/db.js`: MongoDB connection
- `backend/src/middleware/auth.middleware.js`: JWT authentication middleware
- `backend/src/middleware/upload.middleware.js`: avatar upload handling and Cloudinary integration
- `backend/src/modules/auth/*`: register and login logic
- `backend/src/modules/users/*`: profile and game history logic
- `backend/src/modules/game/*`: game engine, AI, session and move management
- `backend/src/modules/multiplayer/*`: online game room management (create, join, list, close)
- `backend/src/modules/billing/*`: wallet, deposits, subscriptions, transactions
- `backend/src/modules/leaderboard/*`: player rankings
- `backend/src/realtime/socketServer.js`: Socket.IO server initialization
- `backend/src/realtime/socketHandlers/gameSocket.js`: real-time game move events
- `backend/src/realtime/socketHandlers/chatSocket.js`: real-time in-game chat events

### Frontend

- `frontend/src/App.jsx`: app routes and top-level user session state
- `frontend/src/components/Navbar/*`: top navigation
- `frontend/src/services/socket.service.js`: Socket.IO client connection management
- `frontend/src/pages/Login/*`: login flow
- `frontend/src/pages/Registration/*`: registration flow
- `frontend/src/pages/Home/*`: home page with game mode selection
- `frontend/src/pages/GameArena/*`: game board, setup, AI play, online play, and in-game chat
- `frontend/src/pages/Lobby/*`: online lobby for creating and joining game rooms
- `frontend/src/pages/Profile/*`: profile management and game history UI
- `frontend/src/pages/Leaderboard/*`: leaderboard with rankings
- `frontend/src/pages/Payment/*`: wallet, deposit, premium subscription
- `frontend/src/pages/Admin/*`: admin dashboard for player and room management
- `frontend/src/utils/http.helper.js`: Axios instance with auth token handling

## How The Project Works

## 1. Authentication Flow

1. A user logs in from the frontend login page.
2. The frontend sends credentials to `POST /api/auth/login`.
3. The backend validates the email and password.
4. If valid, the backend returns:
   - a JWT token
   - basic user information
5. The frontend stores the token and user object in `localStorage`.
6. All later authenticated requests include the token in the `Authorization` header.

## 2. Profile Flow

1. After login, the user opens the profile page.
2. The frontend calls `GET /api/users/profile`.
3. The backend authenticates the token and loads the user from MongoDB.
4. The profile data is shown in the profile card and edit form.

When editing the profile:

1. The frontend sends `PUT /api/users/profile`.
2. The backend validates the update.
3. If the user is changing password, the backend checks the current password first.
4. If validation passes, MongoDB is updated and the new profile is returned.
5. The frontend updates both local state and `localStorage`.

## 3. Avatar Upload Flow

1. The user selects an image on the profile page.
2. The frontend sends a multipart request to `POST /api/users/profile/avatar`.
3. `multer` reads the uploaded file into memory.
4. The backend uploads the image to Cloudinary.
5. Cloudinary applies a `200 x 200` cropped transformation.
6. The backend stores the returned Cloudinary URL in the user record.
7. The frontend updates the avatar immediately using that URL.

## 4. Game History Flow

1. The profile page calls `GET /api/users/game-history`.
2. The backend finds game sessions that include the current user.
3. The backend maps internal values into user-friendly labels:
   - `single` -> `Single Player`
   - `local` -> `Two Players`
   - `online` -> `Online Match`
4. The backend also calculates the result from the current user's perspective:
   - `Win`
   - `Lose`
   - `Draw`
   - `Aborted`
5. For single-player sessions, the opponent shown is the bot name.
6. For local and online sessions, the opponent shown is the other player.
7. The frontend renders the sessions as cards in the History tab.

## 5. Online Multiplayer Flow

### Creating a Room

1. The user navigates to the Online Lobby (`/lobby`).
2. They select a board size and marker, then click "Create Room".
3. The frontend calls `POST /api/multiplayer/rooms` with the configuration.
4. The backend creates a room with status "waiting" and an auto-incremented room number.
5. The user is redirected to `/game?mode=online&roomId=<id>`.
6. The game arena connects a Socket.IO client and emits `game:join`.
7. The "Waiting for Opponent" screen is shown.

### Joining a Room

1. Another user visits the Lobby and sees available waiting rooms.
2. They click "Join" on a room.
3. The frontend calls `POST /api/multiplayer/rooms/:id/join`.
4. The backend sets the room status to "playing" and assigns the second player.
5. The user is redirected to the game arena.
6. Socket.IO emits `game:join`, which triggers `game:playerJoined` for the room creator.
7. Both players see the game board and the match begins.

### Real-Time Gameplay

1. Player 1 always goes first.
2. When a player clicks a cell, the move is applied locally and emitted via `game:move`.
3. The opponent receives `game:moveMade` and the board updates in real-time.
4. Win/draw is detected locally by both clients.
5. The winner emits `game:end` to notify both players.
6. Either player can abort the game, which emits `game:abort`.

### In-Game Chat

1. During an online match, a ChatBox is displayed alongside the board.
2. Players can send messages via `chat:message`.
3. The server broadcasts `chat:newMessage` to both players in the room.
4. Typing indicators are supported via `chat:typing` and `chat:stopTyping`.

## Implemented Features

### Backend Features

- User registration with validation (username, email, password, country)
- User login with JWT (by email or username)
- Brute-force protection (5 failed attempts within 60s blocks login)
- Token blacklisting on logout
- Account activation/deactivation (admin controlled)
- Authenticated profile retrieval
- Edit username, email, country
- Change password with current-password verification
- Avatar upload to Cloudinary
- Game history retrieval for the logged-in player
- Search game history by opponent name or bot name
- Filter game history by game type, result, and date range
- Sort game history by date
- Game engine: 5-in-a-row on 10x10 or 15x15 board
- AI opponents: Easy (random), Medium (defensive), Hard (attack + defense)
- Game session management (create, record moves, end)
- Algebraic notation for moves
- Wallet system: deposit funds, view balance
- Premium subscription ($10 from wallet balance)
- Email notification on subscription via nodemailer
- Leaderboard: ranked by wins, win rate, or total games
- Admin: view all players, toggle active status, view/search/close game rooms
- Multiplayer: create/join/list game rooms with auto-increment room numbers
- WebSocket (Socket.IO): real-time game moves and chat

### Frontend Features

- Login page (email or username)
- Registration page with real-time field validation
- Persistent session via `localStorage`
- Navbar with dynamic links based on auth state and role
- Home page with game mode selection cards
- Game arena with setup (mode, board size, style, markers, difficulty, first player)
- 3 board styles (Classic, Forest, Ocean) and 6 marker choices
- Win animation overlay
- Profile page with tabs:
  - History
  - Edit Profile
- Dark-themed design
- Avatar upload from the profile page
- Editable profile form
- Error handling for incorrect current password on profile update
- Game history cards with opponent, result, type, board size, and date
- Leaderboard page with sort controls and personal stats
- Payment page: wallet balance, deposit, premium subscription, transaction history
- Admin dashboard: player management (block/unblock), game room management (search/close)
- Online Lobby page: create rooms, browse waiting rooms, join rooms
- Real-time online multiplayer via Socket.IO
- In-game chat for online matches with ChatBox component
- Board + chat side-by-side layout for online mode
- Responsive design for mobile and desktop

## Current API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Users

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/profile/avatar`
- `GET /api/users/game-history`

### Game

- `POST /api/game/sessions`
- `GET /api/game/sessions/:id`
- `PUT /api/game/sessions/:id/end`
- `POST /api/game/moves`
- `GET /api/game/sessions/:id/moves`
- `POST /api/game/ai-move`

### Billing

- `GET /api/billing/wallet`
- `POST /api/billing/deposit`
- `POST /api/billing/subscribe`
- `GET /api/billing/transactions`

### Leaderboard

- `GET /api/leaderboard`
- `GET /api/leaderboard/me`

### Admin

- `GET /api/admin/players`
- `PUT /api/admin/players/:id/status`
- `GET /api/admin/game-rooms`
- `PUT /api/admin/game-rooms/:id/close`

### Multiplayer

- `POST /api/multiplayer/rooms`
- `GET /api/multiplayer/rooms`
- `POST /api/multiplayer/rooms/:id/join`
- `GET /api/multiplayer/rooms/:id`

### WebSocket Events (Socket.IO)

#### Game Events

| Client Emits | Server Broadcasts | Description |
|---|---|---|
| `game:join` `{ roomId, userId, username }` | `game:playerJoined` `{ userId, username }` | Join a game room |
| `game:selectMarker` `{ roomId, marker }` | `game:markerSelected` `{ userId, marker }` | Select a marker |
| `game:move` `{ roomId, row, col, marker, moveNumber }` | `game:moveMade` `{ userId, row, col, marker, moveNumber }` | Make a move |
| `game:end` `{ roomId, winnerId, result, winningCells }` | `game:ended` `{ winnerId, result, winningCells }` | End the game |
| `game:abort` `{ roomId }` | `game:aborted` `{ userId, username }` | Abort the game |
| `game:leave` `{ roomId }` | `game:playerLeft` `{ userId, username }` | Leave the room |

#### Chat Events

| Client Emits | Server Broadcasts | Description |
|---|---|---|
| `chat:message` `{ roomId, message }` | `chat:newMessage` `{ userId, username, message, timestamp }` | Send a chat message |
| `chat:typing` `{ roomId }` | `chat:userTyping` `{ username }` | Typing indicator |
| `chat:stopTyping` `{ roomId }` | `chat:userStoppedTyping` `{ username }` | Stop typing indicator |

## Environment Setup

### Backend `.env`

The backend requires these environment variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## How To Run The Project

### 1. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 2. Start the backend

```bash
cd backend
npm run dev
```

or

```bash
cd backend
npm start
```

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on Vite's dev server, typically at `http://localhost:5173`.

The backend runs at `http://localhost:3000`.

## How To Use The Current Implementation

### Login

1. Open the frontend.
2. Go to `/login`.
3. Enter a valid email and password.
4. After login, the app stores your token and redirects to `/profile`.

### View Profile

1. Open the Profile page.
2. The profile card shows avatar, username, email, and country.

### Edit Profile

1. Open the `Edit Profile` tab.
2. Update username, email, or country.
3. To change password, enter:
   - current password
   - new password
4. Save changes.

If the current password is incorrect, the form now shows an error instead of logging the user out.

### Upload Avatar

1. Click the avatar area.
2. Select an image file.
3. The image is uploaded to Cloudinary and reflected on the profile page.

### View Game History

1. Open the `History` tab.
2. See the list of previous sessions.
3. Each session shows:
   - opponent or bot name
   - result
   - game type
   - board size
   - start time

### Search and Filter Game History

- Search by opponent name or bot name
- Filter by:
  - game type
  - result
  - date range
- Toggle date sorting

## Notes About Current Scope

All major features are fully implemented end-to-end:

- Authentication (login, register, logout, brute-force protection, token blacklisting)
- Profile management (edit, avatar upload, game history)
- Game arena (local, vs AI, online multiplayer)
- Online lobby and real-time multiplayer with chat
- Billing (wallet, deposit, premium subscription)
- Leaderboard with rankings
- Admin dashboard (player management, game room management)

## Summary

The application delivers a complete TicTacToang experience with three play modes (local, vs AI, online multiplayer), real-time WebSocket communication, in-game chat, wallet/subscription billing, leaderboards, and admin management. The main user journeys are:

`Register -> Login -> Choose Mode -> Play Game -> View Stats/Leaderboard`

`Login -> Online Lobby -> Create/Join Room -> Real-Time Match with Chat -> Back to Lobby`

`Login -> Profile -> Edit Profile / Upload Avatar / View Game History`

`Admin Login -> Admin Dashboard -> Manage Players / Game Rooms`