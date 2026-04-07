
/**
 * ============================================================================
 * AUTH CONTROLLER (The Receptionist / Front Desk)
 * ============================================================================
 * Purpose: This file handles incoming HTTP requests specifically for the 
 * Authentication module (Logging in, Registering, Logging out). 
 * It acts as the bridge between the Express Routes and the Auth Service.
 * * Key Responsibilities:
 * 1. Extract data from the request (req.body for credentials).
 * 2. Pass that clean data to the AuthService.
 * 3. Receive the generated token and user data from the Service.
 * 4. Send the appropriate HTTP response (200 OK, 201 Created) back to React.
 * 5. Catch any errors (like "Invalid Password") and pass them to next().
 * * CRITICAL RULE: A Controller should NEVER contain bcrypt hashing, JWT 
 * generation, or Mongoose queries. It strictly manages the HTTP flow.
 */

import * as authService from "../services/auth.service.js";

const getBearerToken = (authorizationHeader = "") => {
	if (!authorizationHeader.startsWith("Bearer ")) {
		return null;
	}

	return authorizationHeader.slice(7).trim();
};

const extractSessionContext = (req) => ({
	userAgent: req.headers["user-agent"],
	ipAddress: req.ip,
});

export const register = async (req, res, next) => {
	try {
		const result = await authService.register(req.body, extractSessionContext(req));
		return res.status(201).json({ success: true, data: result });
	} catch (error) {
		return next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const result = await authService.login(req.body, extractSessionContext(req));
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		return next(error);
	}
};

export const me = async (req, res, next) => {
	try {
		const profile = await authService.getMyProfile(req.user.id);
		return res.status(200).json({ success: true, data: profile });
	} catch (error) {
		return next(error);
	}
};

export const logout = async (req, res, next) => {
	try {
		const token = getBearerToken(req.headers.authorization || "");
		const result = await authService.logout(token);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		return next(error);
	}
};