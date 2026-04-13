/**
 * ============================================================================
 * PROTECTED ROUTE COMPONENT (The Security Gatekeeper)
 * ============================================================================
 * Location: src/shared/components/ProtectedRoute/ProtectedRoute.jsx
 * * 🎯 CORE PRINCIPLE:
 * This component acts as a wrapper for routes that require a player to be 
 * logged in (e.g., Play, Profile, Store). If a guest tries to access a 
 * restricted "Toang" area, they are automatically redirected to the Login page.
 * * * FEATURES INCLUDED:
 * 1. Auth Detection: Checks the global AuthProvider state.
 * 2. Role-Based Access: Optionally restricts routes to specific roles (e.g., ADMIN).
 * 3. Loading Resilience: Waits for the initial session check to finish.
 * 4. UX Preservation: Saves the intended URL to redirect the user back after login.
 */

import { createContext, useMemo, useState } from "react";
import { AUTH_USER_KEY, AUTH_TOKEN_KEY } from "../../config/api.config.js";
import { api } from "../../services/api.js";

export const AuthContext = createContext(null);

const readInitialUser = () => {
	try {
		const raw = localStorage.getItem(AUTH_USER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (error) {
		return null;
	}
};

export function AuthProvider({ children }) {
	const [user, setUser] = useState(readInitialUser);

	const login = (userData) => {
		setUser(userData || null);
		if (userData) {
			localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
		}
	};

	const logout = async () => {
        try {
            //backend revocation api
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Session revocation failed on server", error);
        } finally {
            //clears local state and storage
            setUser(null);
            localStorage.removeItem(AUTH_USER_KEY);
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
    };

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