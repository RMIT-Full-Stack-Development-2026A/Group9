
import { createContext, useEffect, useMemo, useState } from "react";
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

	useEffect(() => {
		const token = localStorage.getItem(AUTH_TOKEN_KEY);
		if (!token) return;

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
				if (error.response?.status === 401) {
					setUser(null);
					localStorage.removeItem(AUTH_USER_KEY);
					localStorage.removeItem(AUTH_TOKEN_KEY);
				}
			}
		};

		syncFreshUser();
	}, []);

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