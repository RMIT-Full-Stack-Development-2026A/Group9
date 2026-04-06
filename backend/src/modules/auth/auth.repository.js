import LoginAttempt from "./loginAttempt.model.js";
import AuthToken from "./authToken.model.js";

// --- LoginAttempt operations ---

export const recordLoginAttempt = (data) => LoginAttempt.create(data);

export const getRecentAttempts = (userId, windowMs) => {
  const since = new Date(Date.now() - windowMs);
  return LoginAttempt.find({ userId, attemptTime: { $gte: since } })
    .sort({ attemptTime: -1 });
};

export const clearAttempts = (userId) =>
  LoginAttempt.deleteMany({ userId });

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
