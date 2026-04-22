/**
 * ============================================================================
 * MAIN ROUTER CONFIGURATION (The Navigation Map)
 * ============================================================================
 * Location: src/app/routes/Router.jsx
 * * 🎯 CORE PRINCIPLE:
 * This is the central nervous system for TicTacToang's navigation. It defines 
 * the URL structure, applies security guards (ProtectedRoutes), and 
 * implements "Lazy Loading" to ensure the game remains fast and responsive.
 * * * FEATURES INCLUDED:
 * 1. Code Splitting: Modules are loaded only when the player visits the page.
 * 2. Layout Wrapping: Consistent Navbar/Footer across different "Toang" views.
 * 3. Security Integration: Uses ProtectedRoute to gatekeep sensitive areas.
 * 4. Fallback Logic: Handles 404 (Not Found) errors gracefully.
 */

import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../shared/ui/ProtectedRoute.jsx";

import Admin from "../modules/admin/pages/Admin.jsx";
import ArenaLobby from "../modules/game/pages/ArenaLobby.jsx";
import GameArena from "../modules/game/pages/GameArena.jsx";
import Home from "../modules/home/pages/Home.jsx";
import Leaderboard from "../modules/leaderboard/pages/Leaderboard.jsx";
import Login from "../modules/auth/pages/Login.jsx";
import Payment from "../modules/payment/pages/Payment.jsx";
import Profile from "../modules/profile/pages/Profile.jsx";
import Registration from "../modules/auth/pages/Registration.jsx";

function Router() {
	const allowGuestArena = import.meta.env.DEV || import.meta.env.VITE_ALLOW_GUEST_ARENA === "true";

	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Registration />} />

			<Route
				path="/game"
				element={
					allowGuestArena ? (
						<ArenaLobby />
					) : (
						<ProtectedRoute>
							<ArenaLobby />
						</ProtectedRoute>
					)
				}
			/>
			<Route
				path="/game/:gameId"
				element={
					allowGuestArena ? (
						<GameArena />
					) : (
						<ProtectedRoute>
							<GameArena />
						</ProtectedRoute>
					)
				}
			/>
			<Route
				path="/leaderboard"
				element={
					<ProtectedRoute requirePremium>
						<Leaderboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/payment"
				element={
					<ProtectedRoute>
						<Payment />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<Profile />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin"
				element={
					<ProtectedRoute roles={["admin"]}>
						<Admin />
					</ProtectedRoute>
				}
			/>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default Router;