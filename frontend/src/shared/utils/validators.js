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
// Centralized error messages for validation
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
	unknown: {
		error: 'Unknown Error',
		cause: '',
		example: ''
	}
};

// Centralized registration validation
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
export const isValidUsername = (value) => typeof value === "string" && /^[A-Za-z0-9_-]+$/.test(value);
// Basic validators for frontend use
export const isEmpty = (value) => value === undefined || value === null || String(value).trim() === "";
export const isEmail = (value) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const isStrongPassword = (value) => typeof value === "string" && value.length >= 8;
