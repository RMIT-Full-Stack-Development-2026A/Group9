import * as validators from "../../../shared/utils/validators.js";

// Export DTO functions directly for use by other modules
export const createRegisterDTO = ({ username, email, password, country }) => {
	return {
		username: validators.sanitizeString(username),
		email: validators.sanitizeString(email)?.toLowerCase(),
		password,
		country: validators.sanitizeString(country),
	};
};

export const createLoginDTO = (payload = {}) => {
	const rawIdentifier =
		validators.sanitizeString(payload.identifier || payload.email || payload.username || "") || "";
	const loginType = rawIdentifier.includes("@") ? "email" : "username";
	return {
		identifier: loginType === "email" ? rawIdentifier.toLowerCase() : rawIdentifier,
		password: payload.password,
		loginType,
	};
};

export const validateRegisterPayload = (payload = {}) => {
	const value = createRegisterDTO(payload);
	const errors = [];

	const requiredCheck = validators.assertRequiredFields(value, ["username", "email", "password", "country"]);
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

	const requiredCheck = validators.assertRequiredFields(value, ["identifier", "password"]);
	if (!requiredCheck.valid) {
		errors.push(`Missing required fields: ${requiredCheck.missing.join(", ")}`);
	}

	if (value.loginType === "email" && value.identifier && !isEmail(value.identifier)) {
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
		// Keep login/register response minimal and identity-focused.
		id: user.id || user._id,
		username: user.username,
		email: user.email,
		role: user.role,
		premiumUntil: user.premiumUntil || null,
		avatar: user.avatar || "",
	},
});
