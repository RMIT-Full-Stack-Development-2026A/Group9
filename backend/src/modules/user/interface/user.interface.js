import * as userService from '../services/user.service.js';
import {
	createUserResponseDTO,
	createProfileDTO,
} from '../dto/user.dto.js';

// ── Profile operations (DTO wrapped) ───────────────────────────────────

export const getProfile = async (...args) => {
	const user = await userService.getProfile(...args);
	return createProfileDTO(user);
};

export const updateProfile = async (...args) => {
	const user = await userService.updateProfile(...args);
	return createProfileDTO(user);
};

export const updateAvatar = async (...args) => {
	const user = await userService.updateAvatar(...args);
	return createUserResponseDTO(user);
};

export const getGameHistory = async (...args) => {
	return userService.getGameHistory(...args);
};

// ── Auth-oriented operations ───────────────────────────────────────────
// These return raw data (may include password) for auth module consumption.

export const findUserByEmail = (email) => userService.findUserByEmail(email);

export const findUserByIdentifier = (identifier, loginType) =>
	userService.findUserByIdentifier(identifier, loginType);

export const findUserById = (userId) => userService.findUserById(userId);

export const createUser = (payload) => userService.createUser(payload);

export const updateLoginMetadata = (userId, data) =>
	userService.updateLoginMetadata(userId, data);

// ── Wallet / Premium operations ────────────────────────────────────────

export const getWalletBalance = (userId) => userService.getWalletBalance(userId);

export const addToWallet = (userId, amount) => userService.addToWallet(userId, amount);

export const deductFromWallet = (userId, amount) => userService.deductFromWallet(userId, amount);

export const setPremiumUntil = (userId, date) => userService.setPremiumUntil(userId, date);

export const getAvatar = (userId) => userService.getAvatar(userId);

export const getPremiumUntil = (userId) => userService.getPremiumUntil(userId);
