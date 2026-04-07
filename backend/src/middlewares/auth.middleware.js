/**
 * ============================================================================
 * AUTH MIDDLEWARE CONTRACT (Team Integration Boundary)
 * ============================================================================
 * Purpose: Provide a single, stable authentication/authorization contract for
 * all modules. Teammates should consume these exports as-is instead of writing
 * module-specific auth checks.
 *
 * Exported middlewares:
 * 1) authenticate   -> validates JWT + active AuthSession, sets req.user.
 * 2) authorizeRoles -> role-based access control for protected routes.
 * 3) requirePremium -> premium entitlement check based on premiumUntil.
 *
 * req.user contract set by authenticate:
 * {
 *   id: string,
 *   role: "player" | "admin" | string,
 *   email: string | undefined,
	*   premiumUntil?: Date
 * }
 */

import jwt from "jsonwebtoken";
import AppError from "../modules/shared/errors/AppError.js";
import UserProfile from "../modules/user/models/userProfile.model.js";
import AuthSession from "../modules/auth/models/authSession.model.js";
import { hashSessionToken } from "../modules/auth/utils/sessionToken.util.js";

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

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");
		const tokenHash = hashSessionToken(token);
		const session = await AuthSession.findOne({ token: tokenHash, isRevoked: false }).lean();
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

	const profile = await UserProfile.findById(req.user.id).select("premiumUntil").lean();
	const hasPremium = isPremiumActive(profile?.premiumUntil);
	if (!hasPremium) {
		return next(new AppError("Premium membership is required to access leaderboard", 403));
	}

	req.user.premiumUntil = profile?.premiumUntil || null;
	return next();
};