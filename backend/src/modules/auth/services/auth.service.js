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
 * * CRITICAL RULE: The Service layer knows NOTHING about HTTP. You will never 
 * see 'req', 'res', or 'status(200)' here. If a user provides a bad password, 
 * the Service throws an 'AppError' and trusts the Controller to catch it.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../../shared/errors/AppError.js";
import {
	createAuthResponseDTO,
	createLoginDTO,
	createRegisterDTO,
	validateLoginPayload,
	validateRegisterPayload,
} from "../dto/auth.dto.js";
import * as authRepository from "../repositories/auth.repository.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

// JWT payload is the canonical identity contract used by auth middleware.
const signAccessToken = (user) => {
	return jwt.sign(
		{
			sub: user._id?.toString(),
			email: user.email,
			role: user.role,
			isPremium: Boolean(user.isPremium),
		},
		process.env.JWT_SECRET || "dev_jwt_secret",
		{
			expiresIn: process.env.JWT_EXPIRES_IN || "7d",
		}
	);
};

export const register = async (payload) => {
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

	return createAuthResponseDTO({
		accessToken,
		user: {
			id: createdUser._id,
			username: createdUser.username,
			email: createdUser.email,
			role: createdUser.role,
			isPremium: createdUser.isPremium,
		},
	});
};

export const login = async (payload) => {
	// Use shared DTO rules for consistent auth validation errors.
	const { valid, errors } = validateLoginPayload(payload);
	if (!valid) {
		throw new AppError("Invalid login payload", 400, errors);
	}

	const dto = createLoginDTO(payload);
	const user = await authRepository.findUserByEmail(dto.email);

	if (!user) {
		throw new AppError("Invalid email or password", 401);
	}

	const isPasswordValid = await bcrypt.compare(dto.password, user.password);
	if (!isPasswordValid) {
		throw new AppError("Invalid email or password", 401);
	}

	await authRepository.updateLastLogin(user._id);
	const accessToken = signAccessToken(user);

	return createAuthResponseDTO({
		accessToken,
		user: {
			id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			isPremium: user.isPremium,
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
		isPremium: Boolean(user.isPremium),
		avatar: user.avatar,
	};
};