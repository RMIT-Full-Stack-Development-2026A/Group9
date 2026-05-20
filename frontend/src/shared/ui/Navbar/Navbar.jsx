/**
 * ============================================================================
 * SHARED NAVBAR COMPONENT (The Navigation Hub)
 * ============================================================================
 * Location: src/shared/components/Navbar/Navbar.jsx
 * * 🎯 CORE PRINCIPLE:
 * The persistent navigation anchor for the TicTacToang platform. It handles 
 * responsive layout transitions, authentication-aware links (Guest vs User),
 * and provides quick access to the "Toang" ranking and player profile.
 * * * FEATURES INCLUDED:
 * 1. Auth-Aware UI: Shows "Login/Signup" for guests and "Profile/Logout" for users.
 * 2. Active Link Highlighting: Uses NavLink to visually indicate the current page.
 * 3. Responsive Menu: Collapses into a mobile-friendly layout for small screens.
 * 4. Brand Identity: Houses the iconic TicTacToang logo and "Cyber-Neon" styling.
 */

import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_LINKS = [
	{ label: "Home", to: "/" },
	{ label: "Lobby", to: "/multiplayer" },
	{ label: "Profile", to: "/profile", state: { tab: "edit" }},
];

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
	const { user, logout } = useContext(AuthContext) || {};
	const currentUser = normalizeNavUser(user);
	const navigate = useNavigate();
	const isAuthenticated = Boolean(currentUser);
	const displayName = currentUser?.username || currentUser?.name || currentUser?.email || "Player";

	// Avatar logic: handle base64 avatar from backend
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

	const openHome = () => {
		navigate("/");
	};

	const openLogin = () => {
		navigate("/login");
	};

	const openRegister = () => {
		navigate("/register");
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
						state={item.state}
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
						<button className="authBtn authBtn--solid" type="button" onClick={openRegister}>Register</button>
					</>
				)}
			</div>
		</header>
	);
}