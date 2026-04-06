import * as authService from "./auth.service.js";

/**
 * Auth module interface — the only entry point for other modules.
 * Other modules must NOT import auth services, repositories, or models directly.
 * (Architecture requirement A.3.1)
 */

export const register = (data) => authService.register(data);

export const login = (credentials) => authService.login(credentials);

export const logout = (token) => authService.logout(token);
