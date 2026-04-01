import "./Navbar.css";

const NAV_LINKS = [
	{ label: "Home", href: "#", active: true },
	{ label: "Arena", href: "#" },
	{ label: "Profile", href: "#" },
];

export default function Navbar({ currentUser, onSignInClick, onHomeClick, onLogoutClick }) {
	const isAuthenticated = Boolean(currentUser);
	const displayName = currentUser?.username || "Player";
	const avatarSrc = currentUser?.avatar || "";
	const fallbackInitial = displayName.charAt(0).toUpperCase();

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
									onHomeClick?.();
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
						<button className="logoutIconBtn" type="button" onClick={onLogoutClick} aria-label="Logout">
							<i className="bi bi-box-arrow-right"></i>
						</button>
					</>
				) : (
					<>
						<button className="authBtn authBtn--ghost" type="button" onClick={onSignInClick}>Sign In</button>
						<button className="authBtn authBtn--solid" type="button">Register</button>
					</>
				)}
			</div>
		</header>
	);
}

