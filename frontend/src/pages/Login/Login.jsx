import { Link } from "react-router-dom";
import { useLogin } from "./Login.hook.js";
import Button from "../../components/Button/Button.jsx";
import Input from "../../components/Input/Input.jsx";
import "./Login.css";

const Login = ({ onUserUpdate }) => {
  const { formData, loading, error, handleChange, handleSubmit } =
    useLogin(onUserUpdate);

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">
          <span className="tic">TicTac</span>
          <span className="toang">Toang</span>
        </h2>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email or Username"
            id="identifier"
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="you@example.com or username"
            required
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
