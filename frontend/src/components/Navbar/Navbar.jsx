import "./Navbar.css";
import { useAuth } from "../../context/authContext";

const NAV_LINKS = [
	{ label: "Home", href: "#", active: true },
	{ label: "Arena", href: "#" },
	{ label: "Profile", href: "#" },
];

export default function Navbar() {
	const { user: currentUser, logout } = useAuth();
	const isAuthenticated = Boolean(currentUser);
	const displayName = currentUser?.username || "Player";
	const avatarSrc = currentUser?.avatar || "";
	const fallbackInitial = displayName.charAt(0).toUpperCase();

	const openHome = () => {
		window.location.hash = "#/";
	};

	const openLogin = () => {
		window.location.hash = "#/login";
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
					<a
						key={item.label}
						className={`mainNavLink${item.active ? " mainNavLink--active" : ""}`}
						href={item.label === "Home" ? "#/" : item.href}
						onClick={
							item.label === "Home"
								? (event) => {
									event.preventDefault();
									openHome();
								}
								: undefined
						}
					>
						{item.label}
					</a>
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

