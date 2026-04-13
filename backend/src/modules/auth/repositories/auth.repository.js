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

import UserAccount from "../../user/models/user.model.js";
import UserProfile from "../../user/models/userProfile.model.js";
import AuthSession from "../models/authSession.model.js";

const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const mergeAccountAndProfile = (account, profile) => {
	if (!account) {
		return null;
	}

	return {
		...account,
		premiumUntil: profile?.premiumUntil ?? account?.premiumUntil ?? null,
		avatar: profile?.avatar ?? account?.avatar ?? "",
		country: profile?.country ?? account?.country ?? "",
		walletBalance: Number(profile?.walletBalance ?? account?.walletBalance ?? 0),
	};
};

// Read model-level identity by email. Service owns auth/business decisions.
export const findUserByEmail = async (email) => {
	const account = await UserAccount.findOne({ email }).select("+password").lean();
	if (!account) {
		return null;
	}

	const profile = await UserProfile.findById(account._id).lean();
	return mergeAccountAndProfile(account, profile);
};

export const findUserByIdentifier = async (identifier, loginType = "email") => {
	const query =
		loginType === "email"
			? { email: String(identifier || "").toLowerCase() }
			: { username: new RegExp(`^${escapeRegex(identifier)}$`, "i") };

	const account = await UserAccount.findOne(query).select("+password").lean();
	if (!account) {
		return null;
	}

	const profile = await UserProfile.findById(account._id).lean();
	return mergeAccountAndProfile(account, profile);
};

// Read minimal user profile by id for token/profile flows.
export const findUserById = async (userId) => {
	const account = await UserAccount.findById(userId).lean();
	if (!account) {
		return null;
	}

	const profile = await UserProfile.findById(userId).lean();
	return mergeAccountAndProfile(account, profile);
};

// Persist new user document. Hashing/validation must be done in service.
export const createUser = async (payload) => {
	const { country, avatar, ...accountData } = payload;
	const createdAccount = await UserAccount.create(accountData);
	await UserProfile.create({ _id: createdAccount._id, country, avatar });

	const account = createdAccount.toObject();
	const profile = await UserProfile.findById(createdAccount._id).lean();
	return mergeAccountAndProfile(account, profile);
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

//updates security tracking fields for brute force protection.
export const updateLoginMetadata = async (userId, updateData) => {
    return await UserAccount.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
    );
};
