import { API_BASE_URL, AUTH_TOKEN_KEY } from "../config/api.config";

function buildHeaders(auth, customHeaders = {}) {
	const headers = {
		"Content-Type": "application/json",
		...customHeaders,
	};

	if (auth) {
		const token = localStorage.getItem(AUTH_TOKEN_KEY);
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
	}

	return headers;
}

async function request(method, path, options = {}) {
	const { data, auth = false, headers = {} } = options;

	const response = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers: buildHeaders(auth, headers),
		body: data ? JSON.stringify(data) : undefined,
	});

	let payload = null;
	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		const message = payload?.message || "Request failed";
		const error = new Error(message);
		error.status = response.status;
		error.payload = payload;
		throw error;
	}

	return payload;
}

export const httpHelper = {
	get: (path, options) => request("GET", path, options),
	post: (path, data, options = {}) => request("POST", path, { ...options, data }),
	put: (path, data, options = {}) => request("PUT", path, { ...options, data }),
	patch: (path, data, options = {}) => request("PATCH", path, { ...options, data }),
	del: (path, options) => request("DELETE", path, options),
};
