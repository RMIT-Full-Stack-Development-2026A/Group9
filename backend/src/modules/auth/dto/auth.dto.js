/**
 * ============================================================================
 * AUTH DTO CONTRACT
 * ============================================================================
 * Purpose: Defines request/response DTOs and payload validation used only by
 * the Auth module (register, login, auth response shape).
 *
 * Split-model note:
 * - Identity fields come from UserAccount (id/username/email/role).
 * - Premium entitlement is represented by premiumUntil from UserProfile.
 *
 * Team boundary:
 * - Keep this file auth-only.
 * - Do not add Admin feature DTOs here; place Admin contracts in
 *   modules/admin/dto/admin.dto.js.
 */

import {
	assertRequiredFields,
	isEmail,
	isStrongPassword,
	sanitizeString,
} from "../../../shared/utils/validators.js";

export const createRegisterDTO = ({ username, email, password }) => ({
	username: sanitizeString(username),
	email: sanitizeString(email)?.toLowerCase(),
	password,
});

export const createLoginDTO = (payload = {}) => {
	const rawIdentifier =
		sanitizeString(payload.identifier || payload.email || payload.username || "") || "";
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

	const requiredCheck = assertRequiredFields(value, ["username", "email", "password"]);
	if (!requiredCheck.valid) {
		errors.push(`Missing required fields: ${requiredCheck.missing.join(", ")}`);
	}

	if (value.email && !isEmail(value.email)) {
		errors.push("Email format is invalid");
	}

	if (value.password && !isStrongPassword(value.password)) {
		errors.push("Password must be at least 8 chars and contain upper, lower, and number");
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

	const requiredCheck = assertRequiredFields(value, ["identifier", "password"]);
	if (!requiredCheck.valid) {
		errors.push(`Missing required fields: ${requiredCheck.missing.join(", ")}`);
	}

	if (value.loginType === "email" && value.identifier && !isEmail(value.identifier)) {
		errors.push("Email format is invalid");
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
