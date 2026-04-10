import { API_BASE_URL, AUTH_TOKEN_KEY } from "../../../config/api.config.js";

const getAuthHeaders = () => {
	const token = localStorage.getItem(AUTH_TOKEN_KEY);
	return {
		Authorization: `Bearer ${token}`,
	};
};

/**
 * GET /api/users/me — fetch current user's profile
 * GET /api/users/:userId - fetch target's public profile
 */
export async function fetchProfile(userId = null) {
	const url = userId ? `${API_BASE_URL}/api/users/${userId}` : `${API_BASE_URL}/api/users/me`;
	const res = await fetch(url, {
		headers: getAuthHeaders(),
	});
	const body = await res.json();
	if (!res.ok) throw new Error(body.message || "Failed to load profile");
	return body.data;
}

/**
 * PATCH /api/users/me — update profile fields
 */
export async function updateProfile(data) {
	const res = await fetch(`${API_BASE_URL}/api/users/me`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders(),
		},
		body: JSON.stringify(data),
	});
	const body = await res.json();
	if (!res.ok) throw new Error(body.message || "Failed to update profile");
	return body.data;
}

/**
 * POST /api/users/me/avatar — upload avatar image
 */
export async function uploadAvatar(file) {
	const formData = new FormData();
	formData.append("avatar", file);

	const res = await fetch(`${API_BASE_URL}/api/users/me/avatar`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData,
	});
	const body = await res.json();
	if (!res.ok) throw new Error(body.message || "Failed to upload avatar");
	return body.data;
}

/**
 * GET /api/users/me/history — fetch game session history
 * GET /api/users/:userId/history — fetch public user's history
 */
export async function fetchGameHistory(userId = null, params = {}) {
	const query = new URLSearchParams();
	if (params.search) query.set("search", params.search);
	if (params.result) query.set("result", params.result);
	if (params.gameType) query.set("gameType", params.gameType);
	if (params.dateFrom) query.set("dateFrom", params.dateFrom);
	if (params.dateTo) query.set("dateTo", params.dateTo);
	if (params.sortOrder) query.set("sortOrder", params.sortOrder);

	const url = userId
		? `${API_BASE_URL}/api/users/${userId}/history?${query}`
		: `${API_BASE_URL}/api/users/me/history?${query}`;

	const res = await fetch(url, {
		headers: getAuthHeaders(),
	});
	const body = await res.json();
	if (!res.ok) throw new Error(body.message || "Failed to load game history");
	return body.data;
}