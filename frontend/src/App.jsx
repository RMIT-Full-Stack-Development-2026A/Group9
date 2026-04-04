import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Login from "./pages/Login/Login.jsx";
import Registration from "./pages/Registration/Registration.jsx";
import Home from "./pages/Home/Home.jsx";
import GameArena from "./pages/GameArena/GameArena.jsx";
import Leaderboard from "./pages/Leaderboard/Leaderboard.jsx";
import Payment from "./pages/Payment/Payment.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import { logout } from "./pages/Login/Login.service.js";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      /* still clear local state */
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login onUserUpdate={setUser} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/game"
            element={
              <ProtectedRoute allowedRoles={["player", "admin"]}>
                <GameArena user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["player", "admin"]}>
                <Profile onUserUpdate={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["player", "admin"]}>
                <Payment onUserUpdate={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;