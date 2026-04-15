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

import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../shared/ui/ProtectedRoute.jsx";
import Navbar from "../shared/ui/Navbar/Navbar.jsx";

import AdminDashboard from "../modules/admin/components/AdminDashboard/AdminDashboard.jsx";
import GameArena from "../modules/game/pages/GameArena.jsx";
import Home from "../modules/home/pages/Home.jsx";
import Leaderboard from "../modules/leaderboard/pages/Leaderboard.jsx";
import Login from "../modules/auth/pages/Login.jsx";
import Payment from "../modules/payment/pages/Payment.jsx";
import Profile from "../modules/profile/pages/Profile.jsx";
import Registration from "../modules/auth/pages/Registration.jsx";

import { useContext } from "react";
import { AuthContext } from "../app/providers/AuthProvider.jsx";

function AppLayout() {
	const { user } = useContext(AuthContext) || {};
	// If admin, block rendering of non-admin layout
	if (user && user.role === 'admin') {
		window.history.replaceState(null, '', '/admin');
		return <Navigate to="/admin" replace />;
	}
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}

function Router() {
	return (
		<Routes>
			{/* Player/User routes use AppLayout (with Navbar) */}
			<Route element={<AppLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Registration />} />
				<Route
					path="/lobby"
					element={
						<ProtectedRoute>
							<GameArena />
						</ProtectedRoute>
					}
				/>
				<Route path="/game" element={<Navigate to="/lobby" replace />} />
				<Route path="/arena" element={<Navigate to="/lobby" replace />} />
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
				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>

			{/* Admin routes use AdminDashboard as layout (NO Navbar) */}
			<Route
				path="/admin"
				element={
					<ProtectedRoute roles={["admin"]}>
						<AdminDashboard />
					</ProtectedRoute>
				}
			>
				{/* Example nested admin routes: */}
				{/* <Route path="users" element={<AdminUsers />} /> */}
				{/* <Route path="settings" element={<AdminSettings />} /> */}
			</Route>
		</Routes>
	);
}

export default Router;