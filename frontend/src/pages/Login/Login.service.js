import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../config/api.config";
import { api } from "../../services/api";

export function validateLoginInput(identity, password) {
	const normalizedIdentity = String(identity || "").trim();
	const normalizedPassword = String(password || "");

	if (!normalizedIdentity || !normalizedPassword) {
		return "Username/email and password are required";
	}

	return "";
}

export async function login(identity, password) {
	const payload = await api.post("/api/auth/login", { identity, password });

	localStorage.setItem(AUTH_TOKEN_KEY, payload.token);
	localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user));

	return payload.user;
}

export async function getCurrentUserContext() {
	const profile = await api.get("/api/users/me", { auth: true });
	localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
	return profile;
}

export function getStoredUser() {
	const raw = localStorage.getItem(AUTH_USER_KEY);
	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function hasToken() {
	return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}

export async function logout() {
	try {
		if (hasToken()) {
			await api.post("/api/auth/logout", {}, { auth: true });
		}
	} finally {
		localStorage.removeItem(AUTH_TOKEN_KEY);
		localStorage.removeItem(AUTH_USER_KEY);
	}
}
