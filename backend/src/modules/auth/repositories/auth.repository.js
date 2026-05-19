import * as userInterface from "../../user/interface/user.interface.js";
import AuthSession from "../models/authSession.model.js";

// ── User operations (delegated to user module) ──────────────────────────

export const findUserByEmail = (email) => userInterface.findUserByEmail(email);

export const findUserByIdentifier = (identifier, loginType) =>
	userInterface.findUserByIdentifier(identifier, loginType);

export const findUserById = (userId) => userInterface.findUserById(userId);

export const createUser = (payload) => userInterface.createUser(payload);

export const updateLoginMetadata = (userId, data) =>
	userInterface.updateLoginMetadata(userId, data);

// ── Auth session operations ─────────────────────────────────────────────

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

export const findActiveAuthSessionByTokenHash = async (token) => {
	return AuthSession.findOne({ token, isRevoked: false }).lean();
};

export const revokeAuthSessionByTokenHash = async (token) => {
	return AuthSession.findOneAndUpdate(
		{ token, isRevoked: false },
		{ $set: { isRevoked: true } },
		{ new: true }
	).lean();
};
