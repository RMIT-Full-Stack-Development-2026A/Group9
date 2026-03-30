import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Login from "./pages/Login/Login.jsx";
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

  const handleLogout = useCallback(() => {
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
          <Route path="/" element={<h1 style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-h)" }}>Group 9 Project</h1>} />
          <Route path="/login" element={<Login onUserUpdate={setUser} />} />
          <Route path="/profile" element={<Profile onUserUpdate={setUser} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;