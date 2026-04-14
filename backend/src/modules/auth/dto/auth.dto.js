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

	// Username validation
	if (value.username && !validators.isValidUsername(value.username)) {
		errors.push(
			[
				"Invalid username.",
				"Cause: Username contains invalid characters.",
				"Valid examples: 'john_doe', 'Jane-123', 'user_01'",
				"Allowed: English letters, numbers, underscores, hyphens."
			].join(' ')
		);
	}

	// Email validation
	if (value.email && !validators.isEmail(value.email)) {
		errors.push(
			[
				"Invalid email address.",
				"Cause: Email format is incorrect or contains prohibited characters.",
				"Valid examples: 'user@example.com', 'john.doe@mail.co', 'jane-doe_123@domain.org'",
				"Requirements: Only allowed characters, one '@', at least one '.' after '@', less than 255 characters."
			].join(' ')
		);
	}

	// Password validation
	if (value.password && !validators.isStrongPassword(value.password)) {
		errors.push(
			[
				"Invalid password.",
				"Cause: Password does not meet strength requirements.",
				"Valid examples: 'Password1!', 'My$ecureP@ss', 'Abcdef1#'",
				"Requirements: At least 8 characters, one uppercase letter, one number, one special character."
			].join(' ')
		);
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

		if (value.loginType === "email" && value.identifier && !validators.isEmail(value.identifier)) {
			errors.push([
				"Invalid email address.",
				"Cause: Email format is incorrect or contains prohibited characters.",
				"Valid examples: 'user@example.com', 'john.doe@mail.co', 'jane-doe_123@domain.org'",
				"Requirements: Only allowed characters, one '@', at least one '.' after '@', less than 255 characters."
			].join(' '));
		}
		if (value.loginType === "username" && value.identifier && !validators.isValidUsername(value.identifier)) {
			errors.push([
				"Invalid username.",
				"Cause: Username contains invalid characters.",
				"Valid examples: 'john_doe', 'Jane-123', 'user_01'",
				"Allowed: English letters, numbers, underscores, hyphens."
			].join(' '));
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
