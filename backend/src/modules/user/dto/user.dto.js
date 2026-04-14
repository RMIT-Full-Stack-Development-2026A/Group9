/**
 * ============================================================================
 * USER DTO FILE PURPOSE
 * ============================================================================
 * Purpose: Defines request/response DTO contracts for User module APIs.
 * Current State: Placeholder only, intentionally left for the User feature
 * assignee to implement.
 *
 * Teammate guidance:
 * 1) Add DTO builders for user profile/search/update endpoints.
 * 2) Add payload/query validation helpers used by routes/controllers.
 * 3) Keep this file user-only (do not mix Auth/Admin/Leaderboard DTO logic).
 */

import * as validators from "../../../shared/utils/validators.js";

// Build a DTO for user profile data (for responses)
export const createProfileDTO = (user = {}) => ({
	id: user.id || user._id,
	username: validators.sanitizeString(user.username),
	email: validators.sanitizeString(user.email)?.toLowerCase(),
	country: validators.sanitizeString(user.country),
	role: user.role,
	premiumUntil: user.premiumUntil || null,
	avatar: user.avatar || "",
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});

// Build a DTO for updating user profile
export const createUpdateProfileDTO = (payload = {}) => ({
	username: validators.sanitizeString(payload.username),
	email: validators.sanitizeString(payload.email)?.toLowerCase(),
	country: validators.sanitizeString(payload.country),
	avatar: validators.sanitizeString(payload.avatar),
});

// Validate profile update payload
export const validateProfileUpdatePayload = (payload = {}) => {
	const value = createUpdateProfileDTO(payload);
	const errors = [];

	// At least one field must be present
	if (!value.username && !value.email && !value.country && !value.avatar) {
		errors.push("At least one field (username, email, country, avatar) must be provided");
	}

	if (value.email && !validators.isEmail(value.email)) {
		errors.push("Email format is invalid");
	}

	return {
		valid: errors.length === 0,
		errors,
		value,
	};
};

// Build a minimal user response DTO (for profile endpoints)
export const createUserResponseDTO = (user = {}) => ({
	id: user.id || user._id,
	username: user.username,
	email: user.email,
	country: user.country,
	role: user.role,
	premiumUntil: user.premiumUntil || null,
	avatar: user.avatar || "",
});