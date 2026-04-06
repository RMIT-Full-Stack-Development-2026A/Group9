import {
	assertRequiredFields,
	isEmail,
	isStrongPassword,
	sanitizeString,
} from "../../shared/utils/validators.js";

export const createRegisterDTO = ({ username, email, password }) => ({
	username: sanitizeString(username),
	email: sanitizeString(email)?.toLowerCase(),
	password,
});

export const createLoginDTO = ({ email, password }) => ({
	email: sanitizeString(email)?.toLowerCase(),
	password,
});

export const validateRegisterPayload = (payload = {}) => {
	const value = createRegisterDTO(payload);
	const errors = [];

	const requiredCheck = assertRequiredFields(value, ["username", "email", "password"]);
	if (!requiredCheck.valid) {
		errors.push(`Missing required fields: ${requiredCheck.missing.join(", ")}`);
	}

	if (value.email && !isEmail(value.email)) {
		errors.push("Email format is invalid");
	}

	if (value.password && !isStrongPassword(value.password)) {
		errors.push("Password must be at least 8 chars and contain upper, lower, and number");
	}

	return {
		valid: errors.length === 0,
		errors,
		value,
	};
};

export const validateLoginPayload = (payload = {}) => {
	const value = createLoginDTO(payload);
	const errors = [];

	const requiredCheck = assertRequiredFields(value, ["email", "password"]);
	if (!requiredCheck.valid) {
		errors.push(`Missing required fields: ${requiredCheck.missing.join(", ")}`);
	}

	if (value.email && !isEmail(value.email)) {
		errors.push("Email format is invalid");
	}

	return {
		valid: errors.length === 0,
		errors,
		value,
	};
};

export const createAuthResponseDTO = ({ accessToken, user }) => ({
	accessToken,
	user: {
		id: user.id || user._id,
		username: user.username,
		email: user.email,
		role: user.role,
		isPremium: Boolean(user.isPremium),
	},
});