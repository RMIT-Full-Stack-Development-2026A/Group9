import * as userService from '../services/user.service.js';
import {
	createUserResponseDTO,
	createProfileDTO,
} from '../dto/user.dto.js';

// ── Profile operations (DTO wrapped) ───────────────────────────────────

// Fetch the profile and normalize it into the public profile DTO.
export const getProfile = async (...args) => {
	const user = await userService.getProfile(...args);
	return createProfileDTO(user);
};

// Update the profile and normalize the response.
export const updateProfile = async (...args) => {
	const user = await userService.updateProfile(...args);
	return createProfileDTO(user);
};

// Update the avatar and normalize the response as a user DTO.
export const updateAvatar = async (...args) => {
	const user = await userService.updateAvatar(...args);
	return createUserResponseDTO(user);
};

// Fetch the user's game history without additional wrapping.
export const getGameHistory = async (...args) => {
	return userService.getGameHistory(...args);
};

// ── Auth-oriented operations ───────────────────────────────────────────
// These return raw data (may include password) for auth module consumption.

// Look up a user by email for auth flows.
export const findUserByEmail = (email) => userService.findUserByEmail(email);

// Look up a user by email or username for login flows.
export const findUserByIdentifier = (identifier, loginType) =>
	userService.findUserByIdentifier(identifier, loginType);

// Look up a user by id for auth/session checks.
export const findUserById = (userId) => userService.findUserById(userId);

// Create a new user account and profile for registration.
export const createUser = (payload) => userService.createUser(payload);

// Persist login metadata such as attempts and lock timestamps.
export const updateLoginMetadata = (userId, data) =>
	userService.updateLoginMetadata(userId, data);

// ── Wallet / Premium operations ────────────────────────────────────────

// Read the profile wallet balance.
export const getWalletBalance = (userId) => userService.getWalletBalance(userId);

// Increase the wallet balance.
export const addToWallet = (userId, amount) => userService.addToWallet(userId, amount);

// Decrease the wallet balance.
export const deductFromWallet = (userId, amount) => userService.deductFromWallet(userId, amount);

// Set premium expiry for the user.
export const setPremiumUntil = (userId, date) => userService.setPremiumUntil(userId, date);

// Read premium expiry for the user.
export const getPremiumUntil = (userId) => userService.getPremiumUntil(userId);
