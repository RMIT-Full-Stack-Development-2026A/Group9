
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import { NavLink, useNavigate } from "react-router-dom";

/*
	Navbar
	- Top-level navigation used across the app. Responsibilities:
		* Render brand and primary navigation links
		* Surface authentication actions (Sign In / Register) or the
			authenticated user pill + logout action
		* Normalize different backend user shapes into a consistent
			`currentUser` object consumed by the UI
	- Design notes:
		* Keep markup simple so the header renders quickly.
		* Avatar handling supports both base64 payloads (inline) and
			remote URLs. Cache-busting is applied to URLs to reflect recent
			avatar updates during a user session.
*/

const NAV_LINKS = [
	{ label: "Home", to: "/" },
	{ label: "Lobby", to: "/multiplayer" },
	// Navigate to Profile pre-selecting the Edit tab via location.state
	{ label: "Profile", to: "/profile", state: { tab: "edit" }},
];

/*
  normalizeNavUser(user)
  - Backend flexibility: some API responses include nested shapes like
	`{ account: { ... }, profile: { avatar } }` while others provide a
	flattened `user` object. This helper normalizes both shapes to a
	single `currentUser` object used by the navbar UI.
  - Priority for avatar selection:
	1. `profile.avatar` if available (server-side profile takes precedence)
	2. `account.avatar` as a fallback
	3. empty string when no avatar is present
*/
const normalizeNavUser = (user) => {
	if (!user || typeof user !== "object") {
		return null;
	}

	if (user.account && typeof user.account === "object") {
		const account = user.account;
		const profile = user.profile && typeof user.profile === "object" ? user.profile : {};

		return {
			...account,
			avatar: profile.avatar || account.avatar || "",
		};
	}

	return user;
};

export default function Navbar() {
	// Read auth helpers from context. `logout` is expected to clear server
	// and client-side tokens and update the AuthProvider state.
	const { user, logout } = useContext(AuthContext) || {};
	const currentUser = normalizeNavUser(user);
	const navigate = useNavigate();
	const isAuthenticated = Boolean(currentUser);
	// Human-friendly display name with sensible fallbacks
	const displayName = currentUser?.username || currentUser?.name || currentUser?.email || "Player";

	// Avatar logic supports two formats coming from the backend:
	//  - object with `{ data: base64 }`
	//  - string URL
	// When we have a URL we append a timestamp query param as a simple
	// cache-busting mechanism so users see their updated avatar after
	// uploading without requiring a hard reload.
	let avatarSrc = "";
	if (currentUser?.avatar) {
		if (typeof currentUser.avatar === "object" && currentUser.avatar.data) {
			avatarSrc = `data:image/png;base64,${currentUser.avatar.data}`;
		} else if (typeof currentUser.avatar === "string") {
			// Only append cache buster for URLs, not base64
			if (currentUser.avatar.startsWith("data:image")) {
				avatarSrc = currentUser.avatar;
			} else {
				avatarSrc = `${currentUser.avatar}?t=${Date.now()}`;
			}
		}
	}
	const fallbackInitial = displayName.charAt(0).toUpperCase();

	// Navigation helpers used by the auth buttons
	const openHome = () => {
		navigate("/");
	};

	const openLogin = () => {
		navigate("/login");
	};

	const openRegister = () => {
		navigate("/register");
	};

	// Logout flow: call provider logout which should clear tokens and
	// update app state; then navigate home. We `await` in case providers
	// perform async cleanup (revoke tokens, notify server).
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

			{/* Primary navigation links. Using <NavLink> provides an
				`isActive` callback to style the current route. */}
			<nav className="mainNav" aria-label="Main navigation">
				{NAV_LINKS.map((item) => (
					<NavLink
						key={item.label}
						className={({ isActive }) => `mainNavLink${isActive ? " mainNavLink--active" : ""}`}
						to={item.to}
						state={item.state}
					>
						{item.label}
					</NavLink>
				))}
			</nav>

			{/* Authentication area: either show Sign In/Register or the
				current user pill + logout button when authenticated. */}
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
						<button className="authBtn authBtn--solid" type="button" onClick={openRegister}>Register</button>
					</>
				)}
			</div>
		</header>
	);
}