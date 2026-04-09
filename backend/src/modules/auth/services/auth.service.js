/**
 * ============================================================================
 * AUTH SERVICE (The Brain / Security Core)
 * ============================================================================
 * Purpose: This file contains the absolute core business logic for Authentication. 
 * It is responsible for enforcing security rules, hashing passwords, comparing 
 * credentials, and generating JSON Web Tokens (JWTs).
 * * Key Responsibilities:
 * 1. Enforce business rules (e.g., "Passwords must be hashed before saving").
 * 2. Handle cryptography (bcrypt for passwords, jsonwebtoken for sessions).
 * 3. Coordinate with the AuthRepository to fetch or save user data.
 * 4. Keep Admin feature logic out of this file (Admin belongs to admin service).
 * * CRITICAL RULE: The Service layer knows NOTHING about HTTP. You will never 
 * see 'req', 'res', or 'status(200)' here. If a user provides a bad password, 
 * the Service throws an 'AppError' and trusts the Controller to catch it.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../../../shared/errors/AppError.js";
import {
	createAuthResponseDTO,
	createLoginDTO,
	createRegisterDTO,
	validateLoginPayload,
	validateRegisterPayload,
} from "../dto/auth.dto.js";
import { hashSessionToken } from "../utils/sessionToken.util.js";
import * as authRepository from "../repositories/auth.repository.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

// JWT payload is the canonical identity contract used by auth middleware.
const signAccessToken = (user) => {
	return jwt.sign(
		{
			sub: user._id?.toString(),
			email: user.email,
			role: user.role,
		},
		process.env.JWT_SECRET || "dev_jwt_secret",
		{
			expiresIn: process.env.JWT_EXPIRES_IN || "7d",
		}
	);
};

const resolveExpiresAt = () => {
	const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
	const now = Date.now();

	if (/^\d+$/.test(expiresIn)) {
		return new Date(now + Number(expiresIn) * 1000);
	}

	const match = expiresIn.match(/^(\d+)([smhd])$/i);
	if (!match) {
		return new Date(now + 7 * 24 * 60 * 60 * 1000);
	}

	const amount = Number(match[1]);
	const unit = match[2].toLowerCase();
	const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

	return new Date(now + amount * multipliers[unit]);
};

export const register = async (payload, sessionContext = {}) => {
	// Validate early so downstream layers only receive trusted input shape.
	const { valid, errors } = validateRegisterPayload(payload);
	if (!valid) {
		throw new AppError("Invalid register payload", 400, errors);
	}

	const dto = createRegisterDTO(payload);
	const existingUser = await authRepository.findUserByEmail(dto.email);
	if (existingUser) {
		throw new AppError("Email is already registered", 409);
	}

	const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

	const createdUser = await authRepository.createUser({
		username: dto.username,
		email: dto.email,
		password: passwordHash,
	});

	const accessToken = signAccessToken(createdUser);
	const token = hashSessionToken(accessToken);
	await authRepository.createAuthSession({
		userId: createdUser._id,
		token,
		expiresAt: resolveExpiresAt(),
		userAgent: sessionContext.userAgent,
		ipAddress: sessionContext.ipAddress,
	});

	return createAuthResponseDTO({
		accessToken,
		   user: {
			   id: createdUser._id,
			   username: createdUser.username,
			   email: createdUser.email,
			   role: createdUser.role,
			   premiumUntil: createdUser.premiumUntil,
			   avatar: createdUser.avatar,
		   },
	});
};

export const login = async (payload, sessionContext = {}) => {
	// Use shared DTO rules for consistent auth validation errors.
	const { valid, errors } = validateLoginPayload(payload);
	if (!valid) {
		throw new AppError("Invalid login payload", 400, errors);
	}

	const dto = createLoginDTO(payload);
	let user = await authRepository.findUserByIdentifier(dto.identifier, dto.loginType);

	// Dev convenience: auto-create account on first login attempt.
	if (!user && process.env.NODE_ENV !== "production") {
		const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
		const username = dto.loginType === "email" ? dto.identifier.split("@")[0] || "player" : dto.identifier;
		const generatedLocalPart = String(username || "player")
			.toLowerCase()
			.replace(/[^a-z0-9._-]/g, "") || "player";
		const email = dto.loginType === "email" ? dto.identifier : `${generatedLocalPart}@local.dev`;
		await authRepository.createUser({
			username,
			email,
			password: passwordHash,
		});
		user = await authRepository.findUserByIdentifier(dto.identifier, dto.loginType);
	}

	if (!user) {
		throw new AppError("Invalid username/email or password", 401);
	}

	if (user.isActive === false) {
		throw new AppError("Account is inactive", 403);
	}

	const isPasswordValid = await bcrypt.compare(dto.password, user.password);
	if (!isPasswordValid) {
		throw new AppError("Invalid username/email or password", 401);
	}

	const accessToken = signAccessToken(user);
	const token = hashSessionToken(accessToken);
	await authRepository.createAuthSession({
		userId: user._id,
		token,
		expiresAt: resolveExpiresAt(),
		userAgent: sessionContext.userAgent,
		ipAddress: sessionContext.ipAddress,
	});

	return createAuthResponseDTO({
		accessToken,
		   user: {
			   id: user._id,
			   username: user.username,
			   email: user.email,
			   role: user.role,
			   premiumUntil: user.premiumUntil,
			   avatar: user.avatar,
		   },
	});
};

export const getMyProfile = async (userId) => {
	// Keep profile response minimal; add fields intentionally to avoid API drift.
	const user = await authRepository.findUserById(userId);
	if (!user) {
		throw new AppError("User not found", 404);
	}

	return {
		id: user._id,
		username: user.username,
		email: user.email,
		role: user.role,
		premiumUntil: user.premiumUntil,
		avatar: user.avatar,
		country: user.country,
		walletBalance: user.walletBalance,
	};
};

export const logout = async (accessToken) => {
	if (!accessToken) {
		throw new AppError("Authentication token is required", 400);
	}

	const token = hashSessionToken(accessToken);
	const revokedSession = await authRepository.revokeAuthSessionByTokenHash(token);

	if (!revokedSession) {
		throw new AppError("Authentication session not found or already revoked", 404);
	}

	return { loggedOut: true };
};
