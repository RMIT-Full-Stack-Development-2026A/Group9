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
		error: 'Invalid Characters',
		cause: 'Only letter, number, _ and - allowed.',
		example: 'TicTacToe_P1ayer',
	},
	password: {
		error: 'Weak Password',
		cause: 'Password must be at least 8 characters long.',
		example: 'G@mer2026!',
	},
	confirmPassword: {
		error: 'Mismatch',
		cause: 'Password does not match.',
		example: 'Make sure that both field are the same',
	},
	email: {
		error: 'Invalid Email Format',
		cause: 'The email address is missing a valid domain or "@" symbol.',
		example: 'player1@gmail.com, admin@domain.net',
	},
	required: {
		error: 'All fields are required.'
	},
	loginEmail: {
		error: 'Please enter a valid email address.'
	},
	loginPassword: {
		error: 'Password must be at least 8 characters.'
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
