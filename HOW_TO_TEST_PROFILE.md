# Profile Management — Testing Guide

This guide explains how to properly set up, run, and test the new Profile Management feature in this branch.

## 1. Initial Setup

Open a terminal in the root of the repository.

**Install Backend Dependencies:**
```bash
cd backend
npm install
```

**Install Frontend Dependencies:**
```bash
cd frontend
npm install
```

---

## 2. Environment Variables

Ensure your `backend/.env` file has the necessary MongoDB URI, JWT secret, and **Cloudinary** credentials for avatar uploads to work properly.

Here is what the configuration should look like:
```env
MONGO_URI=mongodb+srv://admin:admin12345@cluster0.ous7vqw.mongodb.net/Group9Clean?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=group9_jwt_secret_key_2026
CLOUDINARY_CLOUD_NAME=djusakesf
CLOUDINARY_API_KEY=698938395711393
CLOUDINARY_API_SECRET=OZ3A_sNmYh7Winn-M5f3f3SN5ms
```

---

## 3. Seed the Database

We have updated the seed script to include more game sessions and complete user profiles so we have mock data to test the History and Profile screens.

Run the seed script from the `backend` folder:
```bash
cd backend
node scripts/seed.js
```
*You should see a message saying "Seed completed successfully!" and a list of created accounts.*

---

## 4. Start the Servers

You need to run both the backend and frontend development servers.

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

---

## 5. Bypassing Login (Developer Login)

Currently, the Frontend Login/Register pages are not fully connected or built out. To view the Profile page (which is a protected route), you must inject a valid Auth Token into your browser session.

1. Open your browser and navigate to `http://localhost:5173`.
2. Open the **Developer Tools** (Press `F12` or Right-Click > Inspect).
3. Go to the **Console** tab.
4. Paste the following script and press `Enter`:

```javascript
fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "khoa@group9.test", password: "Pass123!" })
}).then(r => r.json()).then(d => {
  console.log("Login response:", d);
  if (d.success) {
    localStorage.setItem("authToken", d.data.accessToken);
    localStorage.setItem("currentUser", JSON.stringify(d.data.user));
    window.location.href = "/profile";
  } else {
    console.error("Login failed:", d);
  }
});
```

This will log you in as the seeded user `khoa@group9.test`, store the token, and instantly redirect you to the `/profile` page!

---

## 6. What to Test

Once you are on the `/profile` page, please verify the following:

### 👤 Profile Details
- Check if your Username, Email, and Country render properly in the Header Card.
- Ensure the **⭐ Premium** badge shows up if applicable (it is dynamically rendered).

### 🛠️ Edit Profile Tab
- Go to the **Edit Profile** tab.
- Try changing your **Username**, **Email**, or **Country** and clicking "Save Changes".
- Try updating your **Password** using `Pass123!` as the current password.
- A success message should appear, and your changes should instantly reflect in the header.

### 📷 Avatar Upload
- Click your Circular Avatar placeholder in the top-left of the card.
- Select an image file. The backend will automatically upload it to Cloudinary, resize it to 200x200, and save the URL.
- Verify your new avatar is visible.

### 🕒 History Tab
- Go to the **History** tab. A table containing seeded game history should load.
- **Search:** Search for a specific session number or a player's name (e.g., type `mia`).
- **Filters:** Try filtering by *Game Type* (e.g., `Single Player`) or *Result* (e.g., `Win`).
- **Sort:** Click the Sort button to toggle between Newest/Oldest matches.
