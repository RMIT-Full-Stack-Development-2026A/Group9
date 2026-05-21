
/*
	AuthProvider.jsx
	- Provides authentication state (user + helpers) to the app via React Context.
	- Responsibilities:
		1. Read cached user from `localStorage` on initialization.
		2. If an auth token exists, attempt to sync the latest user profile from
			 the backend to ensure client has up-to-date claims/roles.
		3. Expose `login` and `logout` helpers which update both React state
			 and `localStorage` so the rest of the app can rely on persistence.
*/

import { createContext, useEffect, useMemo, useState } from "react";
import { AUTH_USER_KEY, AUTH_TOKEN_KEY } from "../../config/api.config.js";
import { api } from "../../services/api.js";

export const AuthContext = createContext(null);

// Read the cached user from localStorage once during initialization.
// We wrap parsing in try/catch because corrupted or partially-written JSON
// could otherwise throw and break the entire app during hydration.
const readInitialUser = () => {
	try {
		const raw = localStorage.getItem(AUTH_USER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (error) {
		// Fail closed: if we can't parse the stored value, act as unauthenticated.
		return null;
	}
};

export function AuthProvider({ children }) {
	// `user` holds the current authenticated user's profile or `null`.
	// Initialize from localStorage so refresh/hard reload preserves session state.
	const [user, setUser] = useState(readInitialUser);

	useEffect(() => {
		// If there's no token, there's nothing to sync.
		const token = localStorage.getItem(AUTH_TOKEN_KEY);
		if (!token) return;

		// Sync a fresh copy of the user profile from the API. This ensures
		// the client reflects server-side changes (role updates, bans, etc.)
		// without requiring the user to re-login.
		const syncFreshUser = async () => {
			try {
				const response = await api.get("/api/users/profile");
				const freshUser = response.data;
				if (freshUser) {
					setUser(freshUser);
					localStorage.setItem(AUTH_USER_KEY, JSON.stringify(freshUser));
				}
			} catch (error) {
				console.error("Failed to sync fresh user profile", error);
				// If token is no longer valid, clear persisted auth state.
				if (error.response?.status === 401) {
					setUser(null);
					localStorage.removeItem(AUTH_USER_KEY);
					localStorage.removeItem(AUTH_TOKEN_KEY);
				}
			}
		};

		syncFreshUser();
		// Intentionally run only once on mount. More advanced apps might
		// subscribe to visibility/focus events to refresh opportunistically.
	}, []);

	// Public helper to persist a logged-in user. Keeps both React state and
	// localStorage in sync so refreshes preserve the session.
	const login = (userData) => {
		setUser(userData || null);
		if (userData) {
			localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
		}
	};

	// Logout helper: attempts server-side revocation but always clears client
	// state to avoid leaving a stale session in the UI.
	const logout = async () => {
		try {
			// Attempt to revoke server session; keep path intentionally relative to
			// the API client's base URL. The server may optionally revoke tokens.
			await api.post('/auth/logout');
		} catch (error) {
			// Log but don't block client-side logout — offline or network failures
			// should still allow the user to sign out locally.
			console.error("Session revocation failed on server", error);
		} finally {
			// Clear local client state and storage regardless of server response.
			setUser(null);
			localStorage.removeItem(AUTH_USER_KEY);
			localStorage.removeItem(AUTH_TOKEN_KEY);
		}
	};

	// Memoize the context value to avoid unnecessary re-renders of consumers.
	const value = useMemo(
		() => ({
			user,
			isAuthenticated: Boolean(user),
			login,
			logout,
		}),
		[user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;