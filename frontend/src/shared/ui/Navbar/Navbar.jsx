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

import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";

export default function Navbar() {
	const auth = useContext(AuthContext);

	return (
		<nav className="navbarBase" aria-label="Primary">
			<NavLink to="/" className="navbarBrand">
				TicTacToang
			</NavLink>

			<div className="navbarLinks">
				<NavLink to="/">Home</NavLink>
				<NavLink to="/game">Play</NavLink>
				<NavLink to="/leaderboard">Rankings</NavLink>
				{auth?.isAuthenticated ? (
					<NavLink to="/profile">Profile</NavLink>
				) : (
					<NavLink to="/login">Login</NavLink>
				)}
			</div>
		</nav>
	);
}