/**
 * ============================================================================
 * SHARED VALIDATORS FILE PURPOSE
 * ============================================================================
 * Purpose: Common input validation and sanitization helpers used by multiple
 * module DTOs. Keep these helpers framework-agnostic and side-effect free.
 *
 * Note: This is a core shared foundation file and should not be emptied.
 */

// Email: one '@', at least one '.' after '@', <255 chars, no spaces, no prohibited chars
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRICT_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const EMAIL_PROHIBITED_CHARS = /[\s,;:<>()[\]{}|\\/]/;
// Username: only English letters, numbers, underscore, hyphen
const USERNAME_REGEX = /^[A-Za-z0-9_-]+$/;
const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /\d/;

export const isEmpty = (value) =>
	value === undefined || value === null || String(value).trim() === "";

export const isString = (value) => typeof value === "string";

export const sanitizeString = (value) =>
	isString(value) ? value.trim() : value;

export const isEmail = (value) => {
	if (!isString(value)) return false;
	const email = value.trim();
	if (email.length > 254) return false;
	if (EMAIL_PROHIBITED_CHARS.test(email)) return false;
	if (!STRICT_EMAIL_REGEX.test(email)) return false;
	// Only one '@'
	if ((email.match(/@/g) || []).length !== 1) return false;
	// At least one '.' after '@'
	const atIdx = email.indexOf('@');
	if (atIdx === -1 || email.indexOf('.', atIdx) === -1) return false;
	return true;
};
export const isValidUsername = (value) => {
	return isString(value) && USERNAME_REGEX.test(value.trim());
};

export const isMongoId = (value) =>
	isString(value) && MONGO_ID_REGEX.test(value.trim());

export const isBoardIndex = (value, boardSize = 3) => {
	const cellCount = boardSize * boardSize;
	return Number.isInteger(value) && value >= 0 && value < cellCount;
};

// Password: min 8 chars, 1 number, 1 special char, 1 uppercase
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;
export const isStrongPassword = (value) => {
	return (
		isString(value) &&
		value.length >= 8 &&
		UPPERCASE_REGEX.test(value) &&
		NUMBER_REGEX.test(value) &&
		SPECIAL_CHAR_REGEX.test(value)
	);
};

export const pickDefined = (object = {}, allowedKeys = []) => {
	return allowedKeys.reduce((accumulator, key) => {
		if (object[key] !== undefined) {
			accumulator[key] = object[key];
		}
		return accumulator;
	}, {});
};

export const assertRequiredFields = (payload = {}, requiredFields = []) => {
	const missing = requiredFields.filter((field) => isEmpty(payload[field]));

	return {
		valid: missing.length === 0,
		missing,
	};
};