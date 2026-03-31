import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const avatarSrc = user?.avatar || null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">🎮</span>
        <span>
          <span className="tic">TicTac</span>
          <span className="toang">Toang</span>
        </span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link
          to="/arena"
          className={location.pathname === "/arena" ? "active" : ""}
        >
          Arena
        </Link>
        <Link
          to="/profile"
          className={location.pathname === "/profile" ? "active" : ""}
        >
          Profile
        </Link>
      </div>

      <div className="navbar-user">
        {user ? (
          <>
            <div className="navbar-avatar">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user.username || "Avatar"}
                  className="navbar-avatar-image"
                />
              ) : (
                user.username?.charAt(0)?.toUpperCase() || "?"
              )}
            </div>
            <span className="navbar-username">{user.username}</span>
            <button className="navbar-logout" title="Logout" onClick={onLogout}>
              ⎋
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-login-link">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

