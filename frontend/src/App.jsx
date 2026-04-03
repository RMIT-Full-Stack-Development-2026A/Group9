import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

function PlaceholderPage({ title }) {
  return (
    <main style={{ padding: "40px 24px", textAlign: "center", color: "#d2deec" }}>
      <h1 style={{ color: "#ffffff", marginBottom: "10px" }}>{title}</h1>
      <p>This page is coming soon.</p>
    </main>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/arena" element={<PlaceholderPage title="Arena" />} />
        <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;