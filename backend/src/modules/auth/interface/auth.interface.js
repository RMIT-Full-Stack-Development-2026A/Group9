

import * as authService from '../services/auth.service.js';

// Expose public functions for other modules
export const register = (payload, file, sessionContext) => {
  return authService.register(payload, file, sessionContext);
};

export const login = (payload, sessionContext) => {
  return authService.login(payload, sessionContext);
};

export const getMyProfile = (userId) => {
  return authService.getMyProfile(userId);
};

export const logout = (accessToken) => {
  return authService.logout(accessToken);
};

export const findActiveSession = (tokenHash) => {
  return authService.findActiveSession(tokenHash);
};
