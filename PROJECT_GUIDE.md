# Group 9 Project Guide

## Overview

This project is a full-stack TicTacToang application with a Node.js/Express backend, a React/Vite frontend, and MongoDB for persistence.

At the current stage, the implemented user-facing flow focuses on:

- authentication
- profile management
- avatar upload with Cloudinary
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

### Frontend

- React
- Vite
- React Router
- Axios

## Project Structure

### Backend

- `backend/src/server.js`: application entry point
- `backend/src/app.js`: Express app setup and route mounting
- `backend/src/config/db.js`: MongoDB connection
- `backend/src/middleware/auth.middleware.js`: JWT authentication middleware
- `backend/src/middleware/upload.middleware.js`: avatar upload handling and Cloudinary integration
- `backend/src/modules/auth/*`: register and login logic
- `backend/src/modules/users/*`: profile and game history logic
- `backend/src/modules/game/*`: game-related models

### Frontend

- `frontend/src/App.jsx`: app routes and top-level user session state
- `frontend/src/components/Navbar/*`: top navigation
- `frontend/src/pages/Login/*`: login flow
- `frontend/src/pages/Profile/*`: profile management and game history UI
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

## Implemented Features

### Backend Features

- User registration
- User login with JWT
- Authenticated profile retrieval
- Edit username, email, country
- Change password with current-password verification
- Avatar upload to Cloudinary
- Game history retrieval for the logged-in player
- Search game history by opponent name or bot name
- Filter game history by game type, result, and date range
- Sort game history by date

### Frontend Features

- Login page
- Persistent session via `localStorage`
- Navbar with current user and logout
- Profile page with tabs:
  - History
  - Edit Profile
  - Wallet placeholder
- Dark-themed profile design
- Avatar upload from the profile page
- Editable profile form
- Error handling for incorrect current password on profile update
- Game history cards with opponent, result, type, board size, and date

## Current API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/profile/avatar`
- `GET /api/users/game-history`

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

Some folders exist for future modules, but not all are fully connected in the current frontend flow yet.

Examples:

- billing module exists but wallet UI is still a placeholder
- multiplayer/game modules contain models and structure for future expansion
- the homepage and arena route are not yet fully implemented in the current UI

## Summary

The current implementation delivers a working authentication and profile-management flow backed by MongoDB, with Cloudinary avatar uploads and searchable game history. The main complete end-to-end user journey today is:

`Login -> View Profile -> Edit Profile -> Upload Avatar -> View/Search/Filter Game History`