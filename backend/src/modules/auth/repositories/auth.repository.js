import AuthSession from "../models/authSession.model.js";

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
		{ returnDocument: "after" }
	).lean();
};
