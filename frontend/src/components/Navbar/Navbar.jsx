import "./Navbar.css";
import { useAuth } from "../../context/authContext";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_LINKS = [
	{ label: "Home", to: "/" },
	{ label: "Arena", to: "/arena" },
	{ label: "Profile", to: "/profile" },
];

export default function Navbar() {
	const { user: currentUser, logout } = useAuth();
	const navigate = useNavigate();
	const isAuthenticated = Boolean(currentUser);
	const displayName = currentUser?.username || "Player";
	const avatarSrc = currentUser?.avatar || "";
	const fallbackInitial = displayName.charAt(0).toUpperCase();

	const openHome = () => {
		navigate("/");
	};

	const openLogin = () => {
		navigate("/login");
	};

	const handleLogout = async () => {
		await logout();
		openHome();
	};

	return (
		<header className="topNavbar" role="banner">
			<div className="brandBlock">
				<span className="brandIconFrame">
					<img className="brandIconImage" src="/logo.png" alt="TicTacToang logo" />
				</span>
				<span className="brandText">
					<span className="brandTextLight">TicTac</span>
					<span className="brandTextAccent">Toang</span>
				</span>
			</div>

			<nav className="mainNav" aria-label="Main navigation">
				{NAV_LINKS.map((item) => (
					<NavLink
						key={item.label}
						className={({ isActive }) => `mainNavLink${isActive ? " mainNavLink--active" : ""}`}
						to={item.to}
					>
						{item.label}
					</NavLink>
				))}
			</nav>

			<div className="authActions">
				{isAuthenticated ? (
					<>
						<div className="userPill" title={displayName}>
							<span className="userPillAvatar" aria-hidden="true">
								{avatarSrc ? (
									<img className="userPillAvatarImage" src={avatarSrc} alt={`${displayName} avatar`} />
								) : (
									<span className="userPillAvatarFallback">{fallbackInitial}</span>
								)}
							</span>
							<span className="userPillName">{displayName}</span>
						</div>
						<button className="logoutIconBtn" type="button" onClick={handleLogout} aria-label="Logout">
							<i className="bi bi-box-arrow-right"></i>
						</button>
					</>
				) : (
					<>
						<button className="authBtn authBtn--ghost" type="button" onClick={openLogin}>Sign In</button>
						<button className="authBtn authBtn--solid" type="button">Register</button>
					</>
				)}
			</div>
		</header>
	);
}

