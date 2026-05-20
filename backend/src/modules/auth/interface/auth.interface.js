import * as authService from '../services/auth.service.js';
import { createAuthResponseDTO } from '../dto/auth.dto.js';

export const register = async (payload, file, sessionContext) => {
	const { accessToken, user } = await authService.register(payload, file, sessionContext);
	return createAuthResponseDTO({ accessToken, user });
};

export const login = async (payload, sessionContext) => {
	const { accessToken, user } = await authService.login(payload, sessionContext);
	return createAuthResponseDTO({ accessToken, user });
};

export const getMyProfile = async (userId) => {
	const user = await authService.getMyProfile(userId);
	return createAuthResponseDTO({
		accessToken: null,
		user: { ...user, country: user.country },
	}).user;
};

export const logout = (accessToken) => authService.logout(accessToken);

export const findActiveSession = (tokenHash) => authService.findActiveSession(tokenHash);
