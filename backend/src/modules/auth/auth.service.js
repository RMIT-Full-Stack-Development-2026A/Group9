import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import {
	findUserByUsernameOrEmail,
	resetFailedLoginAttempts,
	setFailedLoginAttempt,
} from "./auth.repository.js";
import { revokeTokenJti } from "./auth.tokenStore.js";


const MAX_FAILED_ATTEMPTS = 5;
const FAILED_WINDOW_MS = 60 * 1000;

function isPremiumUser(user) {
	return Boolean(user.premiumUntil && new Date(user.premiumUntil).getTime() > Date.now());
}

export async function loginUser({ identity, password }) {
	const normalizedIdentity = String(identity || "").trim();
	const submittedPassword = String(password || "");

	if (!normalizedIdentity || !submittedPassword) {
		return {
			ok: false,
			status: 400,
			message: "Username/email and password are required",
		};
	}

	const user = await findUserByUsernameOrEmail(normalizedIdentity);
	if (!user) {
		return {
			ok: false,
			status: 401,
			message: "Invalid credentials",
		};
	}

	const now = Date.now();
	const lastFailedAt = user.lastFailedLogin ? new Date(user.lastFailedLogin).getTime() : 0;
	const withinWindow = lastFailedAt > 0 && now - lastFailedAt <= FAILED_WINDOW_MS;

	if (withinWindow && user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
		return {
			ok: false,
			status: 429,
			message: "Too many failed attempts. Please wait 60 seconds and try again.",
		};
	}

	if (!user.password || typeof user.password !== "string") {
		return {
			ok: false,
			status: 401,
			message: "Invalid credentials",
		};
	}

	const passwordMatches = await bcrypt.compare(submittedPassword, user.password);
	if (!passwordMatches) {
		const nextAttempts = withinWindow ? user.failedLoginAttempts + 1 : 1;
		await setFailedLoginAttempt(user._id, nextAttempts, new Date());

		return {
			ok: false,
			status: 401,
			message: "Invalid credentials",
		};
	}

	await resetFailedLoginAttempts(user._id);

	const jti = crypto.randomUUID();
	const token = jwt.sign(
		{
			role: user.role,
			jti,
		},
		process.env.JWT_SECRET || "dev-secret",
		{
			subject: String(user._id),
			expiresIn: process.env.JWT_EXPIRES_IN || "1h",
		}
	);

	return {
		ok: true,
		status: 200,
		data: {
			token,
			user: {
				id: user._id,
				username: user.username,
				avatar: user.avatar,
				role: user.role,
				isPremium: isPremiumUser(user),
			},
		},
	};
}

export async function logoutUser({ jti, exp }) {
	revokeTokenJti(jti, exp);

	return {
		ok: true,
		status: 200,
		data: {
			message: "Logged out successfully",
		},
	};
}

