import { useState } from "react";
import { useAuth } from "../../context/authContext.jsx";

const Login = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const result = await login(formData.identifier, formData.password);
    
    if (result.success) {
      alert("Logged in successfully!");
    } else {
      setError("The username or password you entered is incorrect. Please try again.");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center" 
         style={{ backgroundColor: "#0a192f", color: "white" }}>
      
      {/*header*/}
      <div className="text-center mb-4">
        <div className="mb-3">
            <span className="p-2 rounded-4 border border-secondary d-inline-block" style={{ backgroundColor: "#112240", fontSize: "25px" }}>
                🔒
            </span>
        </div>
        <h2 className="fw-bold">Welcome Back</h2>
        <p className="text-secondary">Sign in to continue your adventure</p>
      </div>

      {/*login form card*/}
      <div className="card p-4 shadow-lg border-0" 
           style={{ backgroundColor: "#112240", width: "100%", maxWidth: "400px", borderRadius: "15px" }}>
        
        <h3 className="text-white mb-1">Sign In</h3>
        <p className="text-secondary small mb-4">Enter your credentials to access your account</p>

        {/*error notice*/}
        {error && (
          <div className="alert d-flex align-items-start mb-4" 
               style={{ 
                 backgroundColor: "rgba(220, 53, 69, 0.1)", 
                 border: "1px solid #721c24", 
                 color: "#f8d7da",
                 borderRadius: "8px" 
               }}>
            <span className="me-2">⚠️</span>
            <div className="small">
              <strong style={{ color: "#e3342f", display: "block" }}>Invalid credentials</strong>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small text-secondary">Username or Email</label>
            <input 
              type="text" 
              className="form-control border-secondary text-white" 
              style={{ backgroundColor: "#0a192f" }}
              placeholder="Enter your username"
              onChange={(e) => setFormData({...formData, identifier: e.target.value})} 
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small text-secondary">Password</label>
            <input 
              type="password" 
              className="form-control border-secondary text-white" 
              style={{ backgroundColor: "#0a192f" }}
              placeholder="Enter your password"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 small">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label text-secondary" htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="text-info text-decoration-none">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-info w-100 py-2 fw-bold" style={{ backgroundColor: "#00cfde", border: "none" }}>
            Sign In
          </button>
        </form>

        <div className="text-center mt-4 small">
          <span className="text-secondary">Don't have an account? </span>
          <a href="#" className="text-info text-decoration-none">Create one</a>
        </div>
      </div>
    </div>
  );
};

export default Login;