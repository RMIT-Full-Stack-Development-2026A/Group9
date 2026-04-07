import AuthToken from "./authToken.model.js";

// --- AuthToken operations ---

export const createAuthToken = (data) => AuthToken.create(data);

export const revokeToken = (token) =>
  AuthToken.findOneAndUpdate({ token }, { isRevoked: true }, { new: true });

export const isTokenRevoked = async (token) => {
  const record = await AuthToken.findOne({ token });
  return record ? record.isRevoked : false;
};

export const cleanupExpiredTokens = () =>
  AuthToken.deleteMany({ expiresAt: { $lt: new Date() } });
