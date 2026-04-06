import {
	assertRequiredFields,
	isMongoId,
	sanitizeString,
} from "../../shared/utils/validators.js";

export const createBanUserDTO = ({ userId, reason }) => ({
	userId: sanitizeString(userId),
	reason: sanitizeString(reason),
});

export const validateBanUserPayload = (payload = {}) => {
	const value = createBanUserDTO(payload);
	const errors = [];

	const requiredCheck = assertRequiredFields(value, ["userId", "reason"]);
	if (!requiredCheck.valid) {
		errors.push(`Missing required fields: ${requiredCheck.missing.join(", ")}`);
	}

	if (value.userId && !isMongoId(value.userId)) {
		errors.push("userId is not a valid Mongo ObjectId");
	}

	if (value.reason && value.reason.length < 5) {
		errors.push("reason must be at least 5 characters long");
	}

	return {
		valid: errors.length === 0,
		errors,
		value,
	};
};

export const validatePaginationQuery = (query = {}) => {
	const page = Number(query.page ?? 1);
	const limit = Number(query.limit ?? 20);

	const errors = [];
	if (!Number.isInteger(page) || page <= 0) {
		errors.push("page must be a positive integer");
	}
	if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
		errors.push("limit must be an integer between 1 and 100");
	}

	return {
		valid: errors.length === 0,
		errors,
		value: { page, limit },
	};
};