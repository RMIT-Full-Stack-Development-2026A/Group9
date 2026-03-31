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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
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

