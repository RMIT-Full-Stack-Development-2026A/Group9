/**
 * ============================================================================
 * AUTH REPOSITORY (The Vault Manager / Data Access Layer)
 * ============================================================================
 * Purpose: This file is the ONLY place in the Authentication module allowed to 
 * talk directly to the database (MongoDB/Mongoose). It abstracts away the 
 * Mongoose queries so the Service layer doesn't have to know how data is stored.
 * * Key Responsibilities:
 * 1. Execute CRUD operations specifically for user authentication.
 * 2. Return raw database objects back to the Service layer.
 * 3. Keep Admin features out of this file (Admin belongs to admin repository).
 * * CRITICAL RULE: A Repository must NEVER contain business rules (e.g., it 
 * shouldn't check if a password matches) and NEVER know about HTTP. It simply 
 * executes the queries the Service asks for.
 */

import User from "../../user/models/user.model.js";
import AuthSession from "../models/authSession.model.js";
import LoginAttempt from "../models/loginAttempt.model.js";

// Read model-level identity by email. Service owns auth/business decisions.
export const findUserByEmail = async (email) => {
	return User.findOne({ email }).select("+password").lean();
};

// Read minimal user profile by id for token/profile flows.
export const findUserById = async (userId) => {
	return User.findById(userId).lean();
};

// Persist new user document. Hashing/validation must be done in service.
export const createUser = async (payload) => {
	const created = await User.create(payload);
	return created.toObject();
};

// Side-effect update used for security analytics and audit trail.
export const updateLastLogin = async (userId) => {
	return User.findByIdAndUpdate(
		userId,
		{ $set: { lastLoginAt: new Date() } },
		{ new: true }
	).lean();
};

// Track failed login counters for brute-force monitoring and lockout policies.
export const incrementFailedLoginAttempts = async (userId) => {
	if (!userId) {
		return null;
	}

	return User.findByIdAndUpdate(
		userId,
		{
			$inc: { failedLoginAttempts: 1 },
			$set: { lastFailedLogin: new Date() },
		},
		{ new: true }
	).lean();
};

// Reset failed login counters after a successful authentication.
export const resetFailedLoginAttempts = async (userId) => {
	if (!userId) {
		return null;
	}

	return User.findByIdAndUpdate(
		userId,
		{ $set: { failedLoginAttempts: 0, lastFailedLogin: null } },
		{ new: true }
	).lean();
};

// Persist each login outcome for security audit and analytics.
export const createLoginAttempt = async ({ userId = null, success, ipAddress }) => {
	const created = await LoginAttempt.create({
		userId,
		success,
		attemptTime: new Date(),
		ipAddress: ipAddress || "",
	});

	return created.toObject();
};

// Persist issued auth token digest and device metadata in Auth bounded context.
export const createAuthSession = async ({ userId, token, expiresAt, userAgent, ipAddress }) => {
	const created = await AuthSession.create({
		userId,
		token,
		expiresAt,
		userAgent,
		ipAddress,
	});
	return created.toObject();
};

// Resolve an active auth session by hashed token.
export const findActiveAuthSessionByTokenHash = async (token) => {
	return AuthSession.findOne({ token, isRevoked: false }).lean();
};

// Revoke a specific token session (used for logout/revocation flows).
export const revokeAuthSessionByTokenHash = async (token) => {
	return AuthSession.findOneAndUpdate(
		{ token, isRevoked: false },
		{ $set: { isRevoked: true } },
		{ new: true }
	).lean();
};