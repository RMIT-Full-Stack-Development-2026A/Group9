import * as loginAttemptService from "../../../shared/security/loginAttempt.service.js";
import * as tokenBlacklistService from "../../../shared/security/tokenBlacklist.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../../../shared/errors/AppError.js";
import * as validators from "../../../shared/utils/validators.js";
import { hashSessionToken } from "../utils/sessionToken.util.js";
import * as authRepository from "../repositories/auth.repository.js";
import * as userInterface from "../../user/interface/user.interface.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

// ── JWT ──────────────────────────────────────────────────────────────

const signAccessToken = (user) => jwt.sign(
	{ sub: user._id?.toString(), email: user.email, role: user.role },
	process.env.JWT_SECRET || "dev_jwt_secret",
	{ expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);

const resolveExpiresAt = () => {
	const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
	if (/^\d+$/.test(expiresIn)) return new Date(Date.now() + Number(expiresIn) * 1000);
	const match = expiresIn.match(/^(\d+)([smhd])$/i);
	if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
	return new Date(Date.now() + Number(match[1]) * multipliers[match[2].toLowerCase()]);
};

// ── Input helpers ────────────────────────────────────────────────────

function normalizeRegisterInput({ username, email, password, country }) {
	return {
		username: validators.sanitizeString(username),
		email: validators.sanitizeString(email)?.toLowerCase(),
		password,
		country: validators.sanitizeString(country),
	};
}

function validateRegister(payload) {
	const value = normalizeRegisterInput(payload);
	const errors = [];
	const required = validators.assertRequiredFields(value, ["username", "email", "password", "country"]);
	if (!required.valid) errors.push({
		error: "Missing required fields",
		cause: `The following fields are required: ${required.missing.join(", ")}.`,
		example: "Fill in all required fields: username, email, password, confirm password, and country.",
	});
	if (value.username && !validators.isValidUsername(value.username)) errors.push({
		error: "Invalid username",
		cause: "Username must only contain letters, numbers, underscores, or hyphens.",
		example: "Valid: user_123, player-1",
	});
	if (value.email && !validators.isEmail(value.email)) errors.push({
		error: "Invalid email",
		cause: "The email address format is invalid or missing a valid domain or '@' symbol.",
		example: "Valid: player1@gmail.com, admin@domain.net",
	});
	if (value.password && !validators.isStrongPassword(value.password)) errors.push({
		error: "Weak password",
		cause: "Password must be at least 8 characters, include one uppercase letter, one number, and one special character.",
		example: "Try a password like: My$ecureP@ss1!",
	});
	return { valid: errors.length === 0, errors, value };
}

function normalizeLoginInput(payload = {}) {
	const raw = validators.sanitizeString(payload.identifier || payload.email || payload.username || "") || "";
	const loginType = raw.includes("@") ? "email" : "username";
	return {
		identifier: loginType === "email" ? raw.toLowerCase() : raw,
		password: payload.password,
		loginType,
	};
}

function validateLogin(payload) {
	const value = normalizeLoginInput(payload);
	const errors = [];
	const required = validators.assertRequiredFields(value, ["identifier", "password"]);
	if (!required.valid) errors.push({
		error: "Missing required fields",
		cause: `The following fields are required: ${required.missing.join(", ")}.`,
		example: "Please provide both your identifier (email or username) and password.",
	});
	if (value.loginType === "email" && value.identifier && !validators.isEmail(value.identifier)) errors.push({
		error: "Invalid email address",
		cause: "The email format is incorrect.",
		example: "Valid: player1@gmail.com, admin@domain.net",
	});
	if (value.loginType === "username" && value.identifier && !validators.isValidUsername(value.identifier)) errors.push({
		error: "Invalid username",
		cause: "Username must only contain letters, numbers, underscores, or hyphens.",
		example: "Valid: user_123, player-1",
	});
	return { valid: errors.length === 0, errors, value };
}

// ── Public API ───────────────────────────────────────────────────────

export const register = async (payload, file, sessionContext = {}) => {
	const { valid, errors } = validateRegister(payload);
	if (!valid) throw new AppError("Invalid register payload", 400, errors);

	const input = normalizeRegisterInput(payload);
	const existingUser = await userInterface.findUserByEmail(input.email);
	if (existingUser) throw new AppError("Email is already registered", 409);

	const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
	const createdUser = await userInterface.createUser({
		username: input.username,
		email: input.email,
		password: passwordHash,
		country: input.country,
		avatar: file?.cloudinaryUrl || "",
	});

	const accessToken = signAccessToken(createdUser);
	await authRepository.createAuthSession({
		userId: createdUser._id,
		token: hashSessionToken(accessToken),
		expiresAt: resolveExpiresAt(),
		userAgent: sessionContext.userAgent,
		ipAddress: sessionContext.ipAddress,
	});

	return { accessToken, user: createdUser };
};

export const login = async (payload, sessionContext = {}) => {
	const identifier = payload.identifier || payload.email || payload.username;
	if (loginAttemptService.isLocked(identifier, sessionContext.ipAddress))
		throw new AppError("Too many failed login attempts. Please try again later.", 429);

	const { valid, errors } = validateLogin(payload);
	if (!valid) throw new AppError("Invalid login payload", 400, errors);

	const input = normalizeLoginInput(payload);
	let user = await userInterface.findUserByIdentifier(input.identifier, input.loginType);
	if (!user) {
		loginAttemptService.recordFailedAttempt(identifier, sessionContext.ipAddress);
		throw new AppError("Invalid username/email or password", 401);
	}
	if (user.isActive === false) throw new AppError("Account is inactive", 403);
	if (user.lockUntil && user.lockUntil > Date.now()) throw new AppError("Account locked. Try again in 60s.", 429);

	const isMatch = await bcrypt.compare(input.password, user.password);
	if (!isMatch) {
		loginAttemptService.recordFailedAttempt(identifier, sessionContext.ipAddress);
		const attempts = (user.loginAttempts || 0) + 1;
		await userInterface.updateLoginMetadata(user._id, {
			loginAttempts: attempts,
			lockUntil: attempts >= 5 ? Date.now() + 60000 : null,
		});
		throw new AppError("The username or password you entered is incorrect. Please try again", 401);
	}

	await userInterface.updateLoginMetadata(user._id, { loginAttempts: 0, lockUntil: null });
	loginAttemptService.resetAttempts(identifier, sessionContext.ipAddress);

	const accessToken = signAccessToken(user);
	await authRepository.createAuthSession({
		userId: user._id,
		token: hashSessionToken(accessToken),
		expiresAt: resolveExpiresAt(),
		userAgent: sessionContext.userAgent,
		ipAddress: sessionContext.ipAddress,
	});

	return { accessToken, user };
};

export const getMyProfile = async (userId) => {
	const user = await userInterface.findUserById(userId);
	if (!user) throw new AppError("User not found", 404);
	return {
		_id: user._id, username: user.username, email: user.email,
		role: user.role, premiumUntil: user.premiumUntil,
		avatar: user.avatar, country: user.country, walletBalance: user.walletBalance,
	};
};

export const logout = async (accessToken) => {
	if (!accessToken) throw new AppError("Authentication token is required", 400);
	const tokenHash = hashSessionToken(accessToken);
	const revokedSession = await authRepository.revokeAuthSessionByTokenHash(tokenHash);
	try {
		const decoded = jwt.decode(accessToken);
		if (decoded?.exp) tokenBlacklistService.add(accessToken, decoded.exp);
	} catch {}
	if (!revokedSession) throw new AppError("Authentication session not found or already revoked", 404);
	return { loggedOut: true };
};

export const findActiveSession = (tokenHash) =>
	authRepository.findActiveAuthSessionByTokenHash(tokenHash);
