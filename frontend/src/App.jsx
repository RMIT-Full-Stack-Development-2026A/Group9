import { Routes, Route, Link } from "react-router-dom";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  return (
    <div>
      <nav style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: "16px" }}>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Group 9 Project</h1>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;