import AuthSession from "../models/authSession.model.js";

// ── Auth session operations (DB-backed) ───────────────────────────────

// Create a stored session record containing a hashed token so raw JWTs are never persisted
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

// Find a not-revoked session by hashed token
export const findActiveAuthSessionByTokenHash = async (token) => {
	return AuthSession.findOne({ token, isRevoked: false }).lean();
};

// Mark a single session revoked and return the updated document
export const revokeAuthSessionByTokenHash = async (token) => {
	return AuthSession.findOneAndUpdate(
		{ token, isRevoked: false },
		{ $set: { isRevoked: true } },
		{ returnDocument: "after" }
	).lean();
};

// Revoke all sessions for a user (used by admin deactivation or user-requested global logout)
export const revokeAuthSessionsByUserId = async (userId) => {
	return AuthSession.updateMany(
		{ userId, isRevoked: false },
		{ $set: { isRevoked: true } }
	);
};
