import {
	isEmail,
	pickDefined,
	sanitizeString,
} from "../../shared/utils/validators.js";

const ALLOWED_PROFILE_FIELDS = ["username", "country", "avatar"];

export const createUpdateProfileDTO = (payload = {}) => {
	const filtered = pickDefined(payload, ALLOWED_PROFILE_FIELDS);

	return {
		username: sanitizeString(filtered.username),
		country: sanitizeString(filtered.country),
		avatar: sanitizeString(filtered.avatar),
	};
};

export const createProfileQueryDTO = (query = {}) => ({
	email: sanitizeString(query.email)?.toLowerCase(),
	username: sanitizeString(query.username),
});

export const validateUpdateProfilePayload = (payload = {}) => {
	const value = createUpdateProfileDTO(payload);
	const errors = [];

	if (value.username && value.username.length < 3) {
		errors.push("username must be at least 3 characters");
	}

	if (value.country && value.country.length > 56) {
		errors.push("country must be 56 characters or fewer");
	}

	if (value.avatar && value.avatar.length > 2048) {
		errors.push("avatar url is too long");
	}

	return {
		valid: errors.length === 0,
		errors,
		value,
	};
};

export const validateProfileQuery = (query = {}) => {
	const value = createProfileQueryDTO(query);
	const errors = [];

	if (value.email && !isEmail(value.email)) {
		errors.push("email format is invalid");
	}

	if (value.username && value.username.length < 3) {
		errors.push("username must be at least 3 characters");
	}

	return {
		valid: errors.length === 0,
		errors,
		value,
	};
};