import { COUNTRIES } from '../constants/countries';
// Avatar/Image upload validation
export const avatarErrorMessages = {
	invalidFormat: {
		field: 'avatar',
		error: 'Invalid Format',
		cause: 'Only JPG and PNG images are allowed.',
		example: 'Convert your image to .jpg or .png and try again.'
	},
	fileTooLarge: {
		field: 'avatar',
		error: 'File Too Large',
		cause: 'The image exceeds the 5MB size limit.',
		example: 'Compress your image or choose a smaller one.'
	}
};

/**
 * validateAvatarFile(file)
 * - Validates an uploaded File object for avatar uploads.
 * - Returns `null` when valid, or a structured error object from
 *   `avatarErrorMessages` when invalid.
 */
export function validateAvatarFile(file) {
	if (!file) return null;
	if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
		return avatarErrorMessages.invalidFormat;
	}
	const maxSize = 5 * 1024 * 1024; // 5MB
	if (file.size > maxSize) {
		return avatarErrorMessages.fileTooLarge;
	}
	return null;
}

// Centralized error messages for validation so UI can display consistent
// user-facing help content across different forms.
export const errorMessages = {
	username: {
		error: 'Invalid username',
		cause: 'Username must only contain letters, numbers, underscores, or hyphens.',
		example: 'Valid: user_123, player-1'
	},
	password: {
		error: 'Invalid password',
		cause: 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.',
		example: 'Try a password like: My$ecureP@ss1!'
	},
	confirmPassword: {
		error: 'Mismatch',
		cause: 'Password does not match.',
		example: 'Make sure that both fields are the same.'
	},
	email: {
		error: 'Invalid email',
		cause: 'The email address format is invalid or missing a valid domain or "@" symbol.',
		example: 'player1@gmail.com, admin@domain.net'
	},
	required: {
		error: 'All fields are required.'
	},
	duplicateUsername: {
		error: 'Username is already taken',
		cause: 'The username you entered is already in use.',
		example: 'Try a different username.'
	},
	emailAlreadyRegistered: {
		error: 'Email is already registered',
		cause: 'The email address you entered is already associated with an account.',
		example: 'Try logging in or use a different email address.'
	},
	missingFields: {
		error: 'Missing required fields',
		cause: 'One or more required fields are missing.',
		example: 'Fill in all required fields.'
	},
	invalidAvatar: {
		error: 'Invalid avatar',
		cause: 'Avatar upload failed or is not a valid image.',
		example: 'Upload a valid JPG or PNG image.'
	},
	network: {
		error: 'Network Error',
		cause: 'Could not reach the server.',
		example: 'Check if backend is running.'
	},
	invalidRegisterPayload: {
		error: 'Invalid register payload',
		cause: 'One or more registration fields have invalid values.',
		example: 'Ensure all fields meet the format requirements listed above each input.'
	},
	invalidUsername: {
		error: 'Invalid username',
		cause: 'Username must only contain letters, numbers, underscores, or hyphens.',
		example: 'Valid: user_123, player-1'
	},
	invalidEmail: {
		error: 'Invalid email',
		cause: 'The email address format is invalid or missing a valid domain or "@" symbol.',
		example: 'Valid: player1@gmail.com, admin@domain.net'
	},
	weakPassword: {
		error: 'Weak password',
		cause: 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.',
		example: 'Try a password like: My$ecureP@ss1!'
	},
	loginEmail: {
		error: 'Invalid email address',
		cause: 'The email format is incorrect.',
		example: 'Valid: player1@gmail.com, admin@domain.net'
	},
	loginPassword: {
		error: 'Invalid password',
		cause: 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.',
		example: 'Try a password like: My$ecureP@ss1!'
	},
	unknown: {
		error: 'Unknown Error',
		cause: '',
		example: ''
	}
};

// Centralized registration validation
/**
 * validateRegistration(formData)
 * - Validates registration payload on the client side and returns an
 *   array of error objects for invalid fields. Each error contains a
 *   `field` plus message data that can be shown in the UI.
 */
export function validateRegistration(formData) {
	const errors = [];
	if (isEmpty(formData.username) || !isValidUsername(formData.username)) {
		errors.push({ field: 'username', ...errorMessages.username });
	}
	if (!isStrongPassword(formData.password)) {
		errors.push({ field: 'password', ...errorMessages.password });
	}
	if (formData.password !== formData.confirmPassword) {
		errors.push({ field: 'confirmPassword', ...errorMessages.confirmPassword });
	}
	if (!isEmail(formData.email)) {
		errors.push({ field: 'email', ...errorMessages.email });
	}
	// Country required and must be valid
	if (isEmpty(formData.country)) {
		errors.push({ field: 'country', error: 'Country is required.', cause: 'You must select your country from the list.', example: 'Select a country from the dropdown.' });
	} else if (!COUNTRIES.includes(formData.country)) {
		errors.push({ field: 'country', error: 'Invalid country.', cause: 'Selected country is not in the allowed list.', example: 'Choose a valid country from the dropdown.' });
	}
	return errors;
}

// Centralized login validation
/**
 * validateLogin({ identifier, password })
 * - Simple client-side checks for the login form. Returns `null` when
 *   values look valid or an object with an `error` message when invalid.
 */
export function validateLogin({ identifier, password }) {
	if (isEmpty(identifier) || isEmpty(password)) {
		return { error: errorMessages.required.error };
	}
	if (identifier.includes("@") && !isEmail(identifier)) {
		return { error: errorMessages.loginEmail.error };
	}
	if (!isStrongPassword(password)) {
		return { error: errorMessages.loginPassword.error };
	}
	return null;
}

/**
 * isValidUsername(value)
 * - Username may contain letters, numbers, underscores, and hyphens.
 */
export const isValidUsername = (value) => typeof value === "string" && /^[A-Za-z0-9_-]+$/.test(value);

// Basic validators for frontend use
/**
 * isEmpty(value)
 * - Treats undefined, null, and trimmed-empty strings as empty.
 */
export const isEmpty = (value) => value === undefined || value === null || String(value).trim() === "";

// Email: one '@', at least one '.' after '@', <255 chars, no spaces/prohibited chars
/**
 * isEmail(value)
 * - A conservative client-side email validator. It enforces a strict
 *   pattern and additional structural checks (single '@', presence of a
 *   dot after the '@', length limit, and prohibition of whitespace and
 *   certain punctuation characters). The goal is to catch obvious typos
 *   while avoiding overfitting to every possible valid email edge-case.
 */
export const isEmail = (value) => {
	if (typeof value !== "string") return false;
	const email = value.trim();
	if (email.length > 254) return false;
	const EMAIL_PROHIBITED_CHARS = /[\s,;:<>()[\]{}|\\/]/;
	if (EMAIL_PROHIBITED_CHARS.test(email)) return false;
	const STRICT_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
	if (!STRICT_EMAIL_REGEX.test(email)) return false;
	if ((email.match(/@/g) || []).length !== 1) return false;
	const atIdx = email.indexOf('@');
	if (atIdx === -1 || email.indexOf('.', atIdx) === -1) return false;
	return true;
};

// Password: min 8 chars, 1 number, 1 special char, 1 uppercase
/**
 * isStrongPassword(value)
 * - Client-side password strength check used for guidance in the UI.
 *   Requirements: at least 8 characters, one uppercase letter, one
 *   numeric digit, and one non-alphanumeric character.
 */
export const isStrongPassword = (value) => {
	if (typeof value !== "string") return false;
	const UPPERCASE_REGEX = /[A-Z]/;
	const NUMBER_REGEX = /\d/;
	const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;
	return (
		value.length >= 8 &&
		UPPERCASE_REGEX.test(value) &&
		NUMBER_REGEX.test(value) &&
		SPECIAL_CHAR_REGEX.test(value)
	);
};
