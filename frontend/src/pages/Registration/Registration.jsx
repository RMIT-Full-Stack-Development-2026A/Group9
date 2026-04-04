import { Link } from "react-router-dom";
import { useRegistration } from "./Registration.hook.js";
import Button from "../../components/Button/Button.jsx";
import Input from "../../components/Input/Input.jsx";
import "./Registration.css";

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "China", "France", "Germany",
  "India", "Indonesia", "Japan", "South Korea", "Mexico", "Nigeria",
  "Russia", "Singapore", "United Kingdom", "United States", "Vietnam",
];

const Registration = () => {
  const { formData, errors, loading, serverError, handleChange, handleSubmit } =
    useRegistration();

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">
          <span className="tic">TicTac</span>
          <span className="toang">Toang</span>
        </h2>
        <p className="register-subtitle">Create your account</p>

        {serverError && <div className="register-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Player_01"
            error={errors.username}
            required
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            required
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
            error={errors.password}
            required
          />

          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            error={errors.confirmPassword}
            required
          />

          {/* Country dropdown (Req 1.1.4) */}
          <div className="input-group">
            <label htmlFor="country" className="input-label">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`register-select ${errors.country ? "input-field--error" : ""}`}
              required
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && <span className="input-error">{errors.country}</span>}
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;