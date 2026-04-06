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
 * * CRITICAL RULE: A Repository must NEVER contain business rules (e.g., it 
 * shouldn't check if a password matches) and NEVER know about HTTP. It simply 
 * executes the queries the Service asks for.
 */

import User from "../../user/models/user.model.js";

// Read model-level identity by email. Service owns auth/business decisions.
export const findUserByEmail = async (email) => {
	return User.findOne({ email }).lean();
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