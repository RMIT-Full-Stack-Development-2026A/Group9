
// Email validation helpers
// - STRICT_EMAIL_REGEX enforces a conservative allowed character set for local/domain
// - EMAIL_PROHIBITED_CHARS disallows spaces and other problematic punctuation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRICT_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const EMAIL_PROHIBITED_CHARS = /[\s,;:<>()[\]{}|\\/]/;

// Username: allow letters, numbers, underscore and hyphen only
const USERNAME_REGEX = /^[A-Za-z0-9_-]+$/;

// MongoDB ObjectId pattern (24 hex chars)
const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;

// Password character checks
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /\d/;

/**
 * isEmpty
 * - Returns true when a value is undefined, null or an empty/whitespace string.
 * - Safe to use to detect missing payload fields.
 * @param {any} value
 * @returns {boolean}
 */
export const isEmpty = (value) =>
	value === undefined || value === null || String(value).trim() === "";

/**
 * isString
 * - Returns true when the provided value is a string primitive.
 * @param {any} value
 * @returns {boolean}
 */
export const isString = (value) => typeof value === "string";

/**
 * sanitizeString
 * - Trims a string; returns the original value when it's not a string.
 * - Avoids throwing when unexpected types are passed in.
 * @param {any} value
 * @returns {string|any}
 */
export const sanitizeString = (value) =>
	isString(value) ? value.trim() : value;

/**
 * isEmail
 * - Conservative email validation: checks length, prohibited characters,
 *   allowed character set, single '@' and a '.' after the '@'.
 * - Returns false for non-string inputs.
 * @param {string} value
 * @returns {boolean}
 */
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
/**
 * isValidUsername
 * - Username must be a string matching the USERNAME_REGEX (letters, numbers,
 *   underscore and hyphen only). Trims input before checking.
 * @param {string} value
 * @returns {boolean}
 */
export const isValidUsername = (value) => {
	return isString(value) && USERNAME_REGEX.test(value.trim());
};

/**
 * isMongoId
 * - Validates a 24-hex-character MongoDB ObjectId string.
 * - Returns false for non-strings.
 * @param {string} value
 * @returns {boolean}
 */
export const isMongoId = (value) =>
	isString(value) && MONGO_ID_REGEX.test(value.trim());

/**
 * isBoardIndex
 * - Checks whether a numeric value is a valid cell index for a
 *   `boardSize x boardSize` board (default 3x3). Only integers are valid.
 * @param {number} value
 * @param {number} boardSize
 * @returns {boolean}
 */
export const isBoardIndex = (value, boardSize = 3) => {
	const cellCount = boardSize * boardSize;
	return Number.isInteger(value) && value >= 0 && value < cellCount;
};

// Password: min 8 chars, 1 number, 1 special char, 1 uppercase
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;
/**
 * isStrongPassword
 * - Basic strong password check: minimum length 8, contains an uppercase
 *   letter, a number and at least one non-alphanumeric character.
 * - Returns false for non-strings.
 * @param {string} value
 * @returns {boolean}
 */
export const isStrongPassword = (value) => {
	return (
		isString(value) &&
		value.length >= 8 &&
		UPPERCASE_REGEX.test(value) &&
		NUMBER_REGEX.test(value) &&
		SPECIAL_CHAR_REGEX.test(value)
	);
};

/**
 * pickDefined
 * - Returns a shallow object containing only allowed keys whose values are
 *   not `undefined`. Useful to build update objects safely from user input.
 * @param {object} object
 * @param {string[]} allowedKeys
 * @returns {object}
 */
export const pickDefined = (object = {}, allowedKeys = []) => {
	return allowedKeys.reduce((accumulator, key) => {
		if (object[key] !== undefined) {
			accumulator[key] = object[key];
		}
		return accumulator;
	}, {});
};

/**
 * assertRequiredFields
 * - Checks that each field in `requiredFields` exists and is non-empty
 *   in `payload`. Returns an object `{ valid, missing }` to let callers
 *   form helpful error responses.
 * @param {object} payload
 * @param {string[]} requiredFields
 * @returns {{valid:boolean, missing:string[]}}
 */
export const assertRequiredFields = (payload = {}, requiredFields = []) => {
	const missing = requiredFields.filter((field) => isEmpty(payload[field]));

	return {
		valid: missing.length === 0,
		missing,
	};
};