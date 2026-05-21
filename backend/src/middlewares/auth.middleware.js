import jwt from "jsonwebtoken";
import AppError from "../shared/errors/AppError.js";
import * as userInterface from "../modules/user/interface/user.interface.js";
import * as authInterface from "../modules/auth/interface/auth.interface.js";
import { hashSessionToken } from "../modules/auth/utils/sessionToken.util.js";
import * as tokenBlacklistService from "../shared/security/tokenBlacklist.service.js";

// Check whether the stored `premiumUntil` timestamp is still in the future.
// Returns `true` when premium access is active, otherwise `false`.
const isPremiumActive = (premiumUntil) => {
	if (!premiumUntil) {
		return false;
	}

	return new Date(premiumUntil).getTime() > Date.now();
};

// Extracts the raw bearer token from an Authorization header string.
// Returns `null` when the header is missing or does not use the Bearer scheme.
const getBearerToken = (authorizationHeader = "") => {
	if (!authorizationHeader.startsWith("Bearer ")) {
		return null;
	}

	return authorizationHeader.slice(7).trim();
};

export const authenticate = async (req, res, next) => {
	// 1) Extract token from Authorization header
	const token = getBearerToken(req.headers.authorization || "");

	if (!token) {
		return next(new AppError("Authentication required", 401));
	}

	// 2) Quick blacklist check (revoked tokens are rejected immediately)
	if (tokenBlacklistService.isBlacklisted(token)) {
		return next(new AppError("Token has been revoked. Please log in again.", 401));
	}

	try {
		// 3) Verify JWT signature and decode payload
		const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");

		// 4) Ensure the session referenced by this token is still active
		//    Sessions are stored server-side and looked up by a hashed token.
		const tokenHash = hashSessionToken(token);
		const session = await authInterface.findActiveSession(tokenHash);
		if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
			return next(new AppError("Authentication session has expired", 401));
		}

		// 5) Normalise user identity onto `req.user` for downstream handlers
		req.user = {
			id: payload.sub || payload.id || payload.userId,
			role: payload.role || "player",
			email: payload.email,
		};

		if (!req.user.id) {
			return next(new AppError("Invalid authentication token payload", 401));
		}

		// 6) Load the current user record to validate existence and account state
		const currentUser = await userInterface.findUserById(req.user.id);
		if (!currentUser) {
			return next(new AppError("User not found", 401));
		}
		if (currentUser.isActive === false) {
			// Block access for users who have been deactivated
			return next(new AppError("Account is inactive", 403));
		}

		// Authentication successful — continue request handling
		return next();
	} catch (error) {
		// Any verification or lookup error results in a 401 to avoid leaking details
		return next(new AppError("Invalid or expired authentication token", 401));
	}
};

export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return next(new AppError("Authentication required", 401));
		}

		// Ensure the user's role appears in the allowed set for this route
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
	// Check user premium status from the profile service and short-circuit
	// if the user does not currently have an active premium subscription.
	const premiumUntil = await userInterface.getPremiumUntil(req.user.id);
	const hasPremium = isPremiumActive(premiumUntil);
	if (!hasPremium) {
		return next(new AppError("Premium membership is required to access leaderboard", 403));
	}

	// Expose the expiry timestamp on req.user for downstream handlers
	req.user.premiumUntil = premiumUntil || null;
	return next();
};
