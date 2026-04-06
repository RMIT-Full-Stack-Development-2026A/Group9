const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /\d/;

export const isEmpty = (value) =>
	value === undefined || value === null || String(value).trim() === "";

export const isString = (value) => typeof value === "string";

export const sanitizeString = (value) =>
	isString(value) ? value.trim() : value;

export const isEmail = (value) =>
	isString(value) && EMAIL_REGEX.test(value.trim());

export const isMongoId = (value) =>
	isString(value) && MONGO_ID_REGEX.test(value.trim());

export const isBoardIndex = (value, boardSize = 3) => {
	const cellCount = boardSize * boardSize;
	return Number.isInteger(value) && value >= 0 && value < cellCount;
};

export const isStrongPassword = (value) =>
	isString(value) &&
	value.length >= 8 &&
	UPPERCASE_REGEX.test(value) &&
	LOWERCASE_REGEX.test(value) &&
	NUMBER_REGEX.test(value);

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