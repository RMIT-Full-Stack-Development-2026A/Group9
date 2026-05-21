/*
	auth.service.js
	- Client-side authentication helpers.
	- Responsibilities:
		* Call server endpoints for login and registration.
		* Persist received tokens and user profiles in `localStorage`.
		* Normalize and map server error messages into a compact format
			consumable by UI code.
	- Note: `registerPlayer` uses `fetch` directly because it needs to
		submit a `FormData` payload (including binary avatar) and the shared
		`httpHelper` may not be configured for multipart/form-data in the
		same way across environments.
*/

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../../config/api.config.js";
import httpHelper from "../../../shared/utils/http.helper.js";
import { errorMessages } from "../../../shared/utils/validators.js";
import { API_ROUTES } from "../../../config/apiRoutes.js";

// Perform login and persist token + user profile locally.
export const login = async (payload) => {
	const response = await httpHelper.post(API_ROUTES.auth.login, payload);
	const accessToken = response?.data?.accessToken;
	if (accessToken) {
		// Store raw token string. The app's `AuthProvider` will use this to
		// populate Authorization headers for subsequent requests.
		localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
	}
	const user = response?.data?.user;
	if (user) {
		// Cache the serialized user profile for quick client-side checks
		// (e.g., role checks) without making additional network requests.
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
	}
	return response.data;
};

// Convenience helper to call the `me` endpoint. The shared http helper
// is used to keep auth header logic centralized.
export const getMe = async () => {
	return httpHelper(API_ROUTES.auth.login.replace('/login', '/me'), {
		method: "GET",
	});
};

// Register a new player using `FormData`. We map common server error
// messages to UI-friendly `errorMessages` defined in validators so the
// registration form can highlight specific fields.
export const registerPlayer = async (submitData) => {
	const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://group9-backend.onrender.com';//'http://localhost:3000';
	try {
		const response = await fetch(`${apiBase}${API_ROUTES.auth.register}`, {
			method: 'POST',
			body: submitData,
		});
		const data = await response.json();
		if (!response.ok) {
			// Default unknown error shape
			let errObj = errorMessages.unknown;
			// Map server message strings to structured validation objects used by UI
			if (data && data.message) {
				if (data.message === errorMessages.emailAlreadyRegistered.error)
					errObj = errorMessages.emailAlreadyRegistered;
				else if (data.message === errorMessages.invalidRegisterPayload.error)
					errObj = errorMessages.invalidRegisterPayload;
				else if (data.message.toLowerCase().includes('password'))
					errObj = errorMessages.weakPassword;
				else if (data.message === errorMessages.invalidUsername.error)
					errObj = errorMessages.invalidUsername;
				else if (data.message === errorMessages.invalidEmail.error)
					errObj = errorMessages.invalidEmail;
				else if (data.message === errorMessages.duplicateUsername.error)
					errObj = errorMessages.duplicateUsername;
				else if (data.message === errorMessages.missingFields.error)
					errObj = errorMessages.missingFields;
				else if (data.message === errorMessages.invalidAvatar.error)
					errObj = errorMessages.invalidAvatar;
			}
			if (data.details) errObj = { ...errObj, cause: data.details };
			// Throwing an array keeps the UI contract used elsewhere in the app
			// where `apiError` is expected to be an array of field-level objects.
			throw [errObj];
		}
		return data;
	} catch (error) {
		// Normalize network-level errors into the same array-shaped contract.
		if (Array.isArray(error)) throw error;
		throw [{
			error: 'Network Error',
			cause: 'Could not reach the server.',
			example: 'Check if backend is running.'
		}];
	}
};

// Client-only logout helper: clears local persistence. Server-side
// revocation is handled by calling `/auth/logout` elsewhere if required.
export const logout = async () => {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(AUTH_USER_KEY);
	return { success: true };
};
