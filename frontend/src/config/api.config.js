/*
	api.config.js
	- Central place for lightweight client-side API configuration values.
	- `VITE_API_BASE_URL` is a Vite environment variable injected at build time.
		Using `import.meta.env.VITE_API_BASE_URL` lets deployments supply a
		different backend URL without code changes (e.g., staging, production).
	- We fall back to `http://localhost:3000` for developer convenience when
		the env var is not defined.
	- `AUTH_TOKEN_KEY` and `AUTH_USER_KEY` are keys used for `localStorage`
		persistence of the auth token and the cached user profile respectively.
		Keeping these keys centralized avoids accidental typos across the app.
*/

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Key under which the JWT or session token is stored in localStorage
export const AUTH_TOKEN_KEY = "authToken";

// Key under which the serialized user profile is cached in localStorage
export const AUTH_USER_KEY = "currentUser";
