import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1 style={{textAlign:"center"}}>TicTacToang</h1>
        </header>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;