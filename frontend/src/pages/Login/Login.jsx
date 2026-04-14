import { useLogin } from "./Login.hook.js";
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
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
