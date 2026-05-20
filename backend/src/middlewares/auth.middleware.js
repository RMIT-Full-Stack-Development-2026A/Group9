import jwt from "jsonwebtoken";
import AppError from "../shared/errors/AppError.js";
import * as userService from "../modules/user/services/user.service.js";
import * as authService from "../modules/auth/services/auth.service.js";
import { hashSessionToken } from "../modules/auth/utils/sessionToken.util.js";
import * as tokenBlacklistService from "../shared/security/tokenBlacklist.service.js";

const isPremiumActive = (premiumUntil) => {
	if (!premiumUntil) {
		return false;
	}

	return new Date(premiumUntil).getTime() > Date.now();
};

const getBearerToken = (authorizationHeader = "") => {
	if (!authorizationHeader.startsWith("Bearer ")) {
		return null;
	}

	return authorizationHeader.slice(7).trim();
};

export const authenticate = async (req, res, next) => {
	const token = getBearerToken(req.headers.authorization || "");

	if (!token) {
		return next(new AppError("Authentication required", 401));
	}

	// Token blacklist check
	if (tokenBlacklistService.isBlacklisted(token)) {
		return next(new AppError("Token has been revoked. Please log in again.", 401));
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");
		const tokenHash = hashSessionToken(token);
		const session = await authService.findActiveSession(tokenHash);
		if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
			return next(new AppError("Authentication session has expired", 401));
		}

		req.user = {
			id: payload.sub || payload.id || payload.userId,
			role: payload.role || "player",
			email: payload.email,
		};

		if (!req.user.id) {
			return next(new AppError("Invalid authentication token payload", 401));
		}

		return next();
	} catch (error) {
		return next(new AppError("Invalid or expired authentication token", 401));
	}
};

export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return next(new AppError("Authentication required", 401));
		}

		if (!allowedRoles.includes(req.user.role)) {
			return next(new AppError("Forbidden", 403));
		}

		return next();
	};
};

export const requirePremium = async (req, res, next) => {
	if (!req.user?.id) {
		return next(new AppError("Authentication required", 401));
	}

	const premiumUntil = await userService.getPremiumUntil(req.user.id);
	const hasPremium = isPremiumActive(premiumUntil);
	if (!hasPremium) {
		return next(new AppError("Premium membership is required to access leaderboard", 403));
	}

	req.user.premiumUntil = premiumUntil || null;
	return next();
};
