
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../app/providers/AuthProvider.jsx";

/*
  ProtectedRoute
  - A thin route-guard component used with React Router to protect certain
	application routes based on authentication, roles, and premium status.
*/

const isPremiumActive = (premiumUntil) => {
	// Helper: determines whether a stored premium-until timestamp is
	// in the future. Accepts falsy values and returns `false` for them.
	if (!premiumUntil) {
		return false;
	}

	return new Date(premiumUntil).getTime() > Date.now();
};

export default function ProtectedRoute({ children, roles = [], requirePremium = false }) {
	const auth = useContext(AuthContext);
	const location = useLocation();

	// 1) Unauthenticated users are sent to /login. We include the current
	// pathname in location.state so calling code can navigate back after
	// successful authentication if desired.
	if (!auth?.isAuthenticated || !auth?.user) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	// 2) Admin users: special-case that restricts admins to the admin UI.
	// This prevents an admin account from casually browsing the public
	// site and helps avoid accidental interactions that expect a regular
	// user role. We also replace the browser history entry to avoid a
	// confusing back-navigation experience.
	if (auth.user.role === 'admin' && location.pathname !== '/admin') {
		window.history.replaceState(null, '', '/admin');
		return <Navigate to="/admin" replace />;
	}

	// 3) Premium-gated routes: redirect non-premium users to the payment
	// page so they can upgrade. The `isPremiumActive` helper centralizes
	// the expiration logic.
	if (requirePremium && !isPremiumActive(auth.user.premiumUntil)) {
		return <Navigate to="/payment" replace state={{ from: location.pathname }} />;
	}

	// 4) Role-based access control: if a list of allowed roles is provided
	// and the current user's role is not included, redirect to home.
	if (roles.length > 0 && !roles.includes(auth.user.role)) {
		return <Navigate to="/" replace />;
	}

	// 5) If all checks pass, render the protected children
	return children;
}