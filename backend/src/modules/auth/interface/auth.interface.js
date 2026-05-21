import * as authService from '../services/auth.service.js';
import { createAuthResponseDTO } from '../dto/auth.dto.js';

// Thin interface layer: call service, normalize response via DTO

// Register: wrapper that accepts raw payload and optional avatar `file`.
// Calls the service to create the user and session, then maps the
// result to the `createAuthResponseDTO` shape for API responses.
export const register = async (payload, file, sessionContext) => {
	const { accessToken, user } = await authService.register(payload, file, sessionContext);
	return createAuthResponseDTO({ accessToken, user });
};

// Login: accepts `{ identifier, password }` and an optional `sessionContext`.
// Delegates authentication to the service and returns the normalized DTO
// containing `accessToken` and the safe `user` object (no sensitive fields).
export const login = async (payload, sessionContext) => {
	const { accessToken, user } = await authService.login(payload, sessionContext);
	return createAuthResponseDTO({ accessToken, user });
};

// getMyProfile: fetch a user's profile by id and return the normalized
// user object (reuses DTO mapping; `accessToken` is null here).
export const getMyProfile = async (userId) => {
	const user = await authService.getMyProfile(userId);
	// Reuse DTO to produce normalized user shape; accessToken is null here
	return createAuthResponseDTO({
		accessToken: null,
		user: { ...user, country: user.country },
	}).user;
};

// Logout: revoke the session corresponding to the given raw access token.
// Delegates to the service which handles token hashing, DB revocation
// and best-effort blacklisting until the token naturally expires.
export const logout = (accessToken) => authService.logout(accessToken);

// Find an active (not revoked) session by the stored token hash.
// Used by middleware or other security checks to validate that a token
// still corresponds to a live server-side session.
export const findActiveSession = (tokenHash) => authService.findActiveSession(tokenHash);

// Revoke all sessions belonging to a user. Useful for account deactivation,
// admin actions, or when a user requests global logout across devices.
export const revokeAllSessionsForUser = (userId) => authService.revokeAllSessionsForUser(userId);
