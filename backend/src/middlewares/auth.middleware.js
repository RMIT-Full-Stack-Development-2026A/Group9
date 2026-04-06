import jwt from "jsonwebtoken";
import AppError from "../modules/shared/errors/AppError.js";
import User from "../modules/user/models/user.model.js";

const getBearerToken = (authorizationHeader = "") => {
	if (!authorizationHeader.startsWith("Bearer ")) {
		return null;
	}

	return authorizationHeader.slice(7).trim();
};

export const authenticate = (req, res, next) => {
	const token = getBearerToken(req.headers.authorization || "");

	if (!token) {
		return next(new AppError("Authentication required", 401));
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");

		req.user = {
			id: payload.sub || payload.id || payload.userId,
			role: payload.role || "player",
			email: payload.email,
			isPremium: payload.isPremium,
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

	if (req.user.isPremium === true) {
		return next();
	}

	const user = await User.findById(req.user.id).select("isPremium").lean();
	if (!user?.isPremium) {
		return next(new AppError("Premium membership is required to access leaderboard", 403));
	}

	req.user.isPremium = true;
	return next();
};