import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../../config/api.config.js";
import httpHelper from "../../../shared/utils/http.helper.js";
import { errorMessages } from "../../../shared/utils/validators.js";
import { API_ROUTES } from "../../../config/apiRoutes.js";

export const login = async (payload) => {
	const response = await httpHelper.post(API_ROUTES.auth.login, payload);
	const accessToken = response?.data?.accessToken;
	if (accessToken) {
		localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
	}
	const user = response?.data?.user;
	if (user) {
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
	}
	return response.data;
};

export const getMe = async () => {
	return httpHelper(API_ROUTES.auth.login.replace('/login', '/me'), {
		method: "GET",
	});
};

export const registerPlayer = async (submitData) => {
	const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://group9-backend.onrender.com';//'http://localhost:3000';
	try {
		const response = await fetch(`${apiBase}${API_ROUTES.auth.register}`, {
			method: 'POST',
			body: submitData,
		});
		const data = await response.json();
		if (!response.ok) {
			let errObj = errorMessages.unknown;
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
			throw [errObj];
		}
		return data;
	} catch (error) {
		if (Array.isArray(error)) throw error;
		throw [{
			error: 'Network Error',
			cause: 'Could not reach the server.',
			example: 'Check if backend is running.'
		}];
	}
};

export const logout = async () => {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(AUTH_USER_KEY);
	return { success: true };
};
