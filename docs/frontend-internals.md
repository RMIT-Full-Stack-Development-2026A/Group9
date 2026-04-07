# Frontend Internal Architecture — TicTacToang

This document explains the internal workings of the React frontend: how state is managed, how pages transition, how localStorage is used, how the avatar update propagates, and what information the JWT token carries.

---

## 1. State Management Approach

### Type: Local component state — no global state library

The project uses **React's built-in `useState` and `useEffect` hooks only**. There is no Redux, Zustand, Recoil, MobX, or React Context in use.

Each page owns its own state through a dedicated custom hook:

| Page | Hook file |
|---|---|
| Admin Dashboard | `Admin.hook.js` |
| Profile | `Profile.hook.js` |
| Login | `Login.hook.js` |
| Registration | `Registration.hook.js` |
| Game Arena | `GameArena.hook.js` |
| Leaderboard | `Leaderboard.hook.js` |
| Lobby | `Lobby.hook.js` |
| Payment | `Payment.hook.js` |

The only state that crosses page boundaries is the `user` object, which lives in `App.jsx` and is passed down to child components as a prop.

---

## 2. Why No Global State Management?

**It was not needed** given the scale and shape of the application. Here is the reasoning:

1. **Only one piece of shared state exists** — the logged-in `user` object. Everything else (player lists, game board, transactions, leaderboard) is local to a single page and is never read by another page simultaneously.

2. **The `user` object is already lifted one level** — to `App.jsx` — so the Navbar, ProtectedRoute, and all pages can consume it via props. This `prop-drilling` pattern is completely appropriate at this scale (2-3 levels deep).

3. **Every page fetches its own data on mount** — there is no scenario where two pages need to share a reactive slice of server data at the same time.

4. **Adding Redux or Zustand would be over-engineering** for a project where one `useState` in `App.jsx` solves the only real cross-component problem.

The rule of thumb applied here: reach for a global store when prop-drilling exceeds 3-4 levels or when unrelated components need to react to the same state change. Neither condition exists here.

---

## 3. How State Transitions Work — Player List Example

Below is the complete state flow for the Admin Dashboard player list.

### Initial load

```
Admin.jsx renders
  └── calls useAdmin() hook
        └── useState initialises: players=[], loading=true
        └── useEffect fires → fetchPlayers()
              └── adminService.getAllPlayers()   // GET /api/admin/players
                    └── setPlayers(data)         // React re-renders the table
                    └── setLoading(false)        // spinner hidden
```

### User clicks "Block" on a player

```
Button onClick → handleToggleStatus(playerId, true)
  └── adminService.togglePlayerStatus(playerId, false)  // PUT /api/admin/players/:id/status
  └── setPlayers(prev =>
        prev.map(p =>
          p._id === playerId ? { ...p, isActive: false } : p
        )
      )
```

No refetch is performed. The API confirms the change succeeded, then the local `players` array is updated **optimistically in-place** using `.map()`. React diffs the virtual DOM and only re-renders the changed row — the button label flips from "Block" to "Unblock", and the status badge changes colour.

This is the standard local state update pattern used everywhere in the project.

---

## 4. localStorage — What Is Stored, What Variable, and Why

The project writes to two specific keys in `localStorage`:

| Key | Value type | Set when | Read when |
|---|---|---|---|
| `token` | `String` — raw JWT | Login succeeds | Every API request (axios interceptor) |
| `user` | `String` — JSON serialised user object | Login or profile/avatar update | App startup, ProtectedRoute check |

### The `user` object shape stored in localStorage

```json
{
  "_id": "...",
  "username": "Khoa",
  "email": "khoa@example.com",
  "country": "Vietnam",
  "avatar": "https://res.cloudinary.com/.../avatar.jpg",
  "role": "player",
  "isPremium": false
}
```

This is exactly what `toProfileDTO` or `toAuthDTO` returns from the backend — sensitive fields like `password` and `walletBalance` are never included.

### Why localStorage (not sessionStorage or cookies)?

- The token must survive a **browser refresh** — `sessionStorage` clears on tab close.
- The project does not use `httpOnly` cookies, which would be the most secure option, but would require additional backend configuration for CSRF protection.
- The `user` object in localStorage means the app can restore the Navbar username/avatar and ProtectedRoute role checks **synchronously** on startup without waiting for a network request.

### Was anything stored before the recent changes?

Nothing changed regarding localStorage. Both `token` and `user` have been stored there since the Login feature was first built. The recent refactoring (interfaces, DTOs, models) was entirely backend-side and did not touch storage behaviour.

---

## 5. How the App Restores State on Refresh

In `App.jsx`:

```js
// Runs once on mount
useEffect(() => {
  const stored = localStorage.getItem("user");
  if (stored) {
    setUser(JSON.parse(stored));
  }
}, []);
```

On every navigation/refresh, React mounts `App`, reads the stored user, and calls `setUser`. This makes the Navbar immediately show the avatar and username without a network call.

---

## 6. Avatar Update Flow — Complete End-to-End

This is the most involved state propagation in the frontend.

### Step 1 — User picks a file

```
<input type="file" onChange={handleAvatarUpload} />
```

In `Profile.hook.js`:
```js
const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  const fd = new FormData();
  fd.append("avatar", file);
  const { data } = await profileService.uploadAvatar(fd); // POST /api/users/profile/avatar
  syncUser(data);
};
```

### Step 2 — Backend processing

```
POST /api/users/profile/avatar
  → upload middleware (Multer) — stores file in memory
  → uploadToCloudinary middleware — uploads buffer to Cloudinary, attaches URL to req.file.cloudinaryUrl
  → userController.uploadAvatar
      → userService.updateAvatar(req.userId, req.file.cloudinaryUrl)
          → userRepository.updateUser(id, { avatar: cloudinaryUrl })
              → MongoDB document updated
      → returns toProfileDTO(updatedUser)  ← includes new avatar URL
```

### Step 3 — Frontend receives the response

`syncUser(data)` is called in the hook:

```js
const syncUser = useCallback((nextUser) => {
  setUser(nextUser);                              // 1. update hook's local user state
  localStorage.setItem("user", JSON.stringify(nextUser)); // 2. persist to localStorage
  if (onUserUpdate) onUserUpdate(nextUser);       // 3. call the callback passed from App.jsx
}, [onUserUpdate]);
```

### Step 4 — Navbar updates

`Profile` receives `onUserUpdate={setUser}` as a prop from `App.jsx`. When `syncUser` calls `onUserUpdate(nextUser)`, it calls `setUser` in `App.jsx`, updating the top-level `user` state. Since `Navbar` receives `user` as a prop from `App.jsx`, React re-renders Navbar with the new avatar URL immediately.

```
syncUser(data)
  → setUser(data)             ← local Profile state
  → localStorage.set("user")  ← persisted for refresh
  → onUserUpdate(data)        ← calls App.jsx setUser
      → App re-renders
          → Navbar re-renders with new user.avatar
```

The avatar in the Navbar updates **in the same React render cycle** as the Profile page, with no additional network request.

---

## 7. JWT Token — What Information It Contains

### When the token is created (backend — `auth.service.js`)

```js
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
```

The token **payload** contains exactly:

| Field | Value | Purpose |
|---|---|---|
| `userId` | MongoDB ObjectId string | Identifies the user on every authenticated request |
| `role` | `"player"` or `"admin"` | Used by `authorize()` middleware for role-based access |
| `iat` | Unix timestamp (auto-added by JWT) | Token issued-at time |
| `exp` | Unix timestamp (auto-added by JWT) | Token expiry — 7 days after issue |

The token does **not** include: `username`, `email`, `avatar`, `isPremium`, `walletBalance`, or `password`.

### How the token is sent to the backend

In `http.helper.js`, an axios request interceptor attaches the token to every outgoing request:

```js
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Every API call automatically sends:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### How the backend reads the token

In `auth.middleware.js`:

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userId = decoded.userId;
// Then fetches user from DB to get current role and isActive status
const user = await userInterface.getUserForAuth(decoded.userId);
req.userRole = user.role;
```

The middleware re-fetches the user from the database on **every request** to ensure the role and `isActive` flag are always current. It does not trust the `role` from the token alone — if an admin deactivates a user, the next request the user makes will be rejected even though their token has not expired yet.

### Token revocation (logout)

When the user logs out:

1. Frontend sends `POST /api/auth/logout`
2. Backend calls `tokenBlacklistService.blacklistToken(token)` — adds the token string to an in-memory `Set`
3. Frontend removes `token` and `user` from `localStorage`
4. Frontend navigates to `/login`

On any subsequent request with the old token, `auth.middleware.js` checks `isTokenBlacklisted(token)` and returns `401` before the route handler is ever reached.

---

## 8. ProtectedRoute — How Access is Enforced on the Frontend

```js
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const stored = localStorage.getItem("user");

  if (!token || !stored) return <Navigate to="/login" replace />;

  const user = JSON.parse(stored);
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};
```

This is a **client-side guard only** — it prevents unauthorised navigation within the React app. The real enforcement is on the backend, where every protected route passes through `authenticate` and `authorize` middleware. A user who manually removes the `ProtectedRoute` check would still receive `401` or `403` from the API.

---

## 9. Summary Diagram — Data Flow

```
User action
    │
    ▼
Page component (JSX)
    │  calls
    ▼
Custom Hook (useState + useEffect)
    │  calls
    ▼
Service file (http.helper axios)
    │  attaches Bearer token from localStorage
    │  sends HTTP request
    ▼
Backend API
    │  auth.middleware verifies JWT → extracts userId, role
    │  route handler → controller → service → repository → MongoDB
    │  returns DTO (no password, no walletBalance in sensitive routes)
    ▼
Service file receives response
    │
    ▼
Custom Hook updates state (useState setter)
    │  optionally calls syncUser → localStorage.set + onUserUpdate prop
    ▼
React re-renders component with new state
```
