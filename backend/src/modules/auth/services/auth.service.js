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
    const { identifier, password } = payload;
    
    //see if the user provided an email or a username
    const loginType = identifier.includes("@") ? "email" : "username";
    
    //use the existing repo signature
    const user = await authRepository.findUserByIdentifier(identifier, loginType);
    
    if (!user || user.isActive === false) {
        throw new AppError("The username or password you entered is incorrect. Please try again", 401);
    }

    //brute force check
    if (user.lockUntil && user.lockUntil > Date.now()) {
        throw new AppError("Account locked. Try again in 60s.", 429);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        const attempts = (user.loginAttempts || 0) + 1;
        const lockUntil = attempts >= 5 ? Date.now() + 60000 : null;
        
        //use new repo func added above
        await authRepository.updateLoginMetadata(user._id, { 
            loginAttempts: attempts, 
            lockUntil 
        });
        
        throw new AppError("The username or password you entered is incorrect. Please try again", 401);
    }

    //login success: reset attempts
    await authRepository.updateLoginMetadata(user._id, { 
        loginAttempts: 0, 
        lockUntil: null 
    });

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
