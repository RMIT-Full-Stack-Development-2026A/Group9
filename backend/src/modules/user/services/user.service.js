import bcrypt from "bcryptjs";
import AppError from "../../../shared/errors/AppError.js";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary.js";
import * as userRepo from "../repositories/user.repository.js";

/**
 * Get combined profile (account + profile doc).
 */
export async function getProfile(userId) {
	const [account, profile] = await Promise.all([
		userRepo.findAccountById(userId),
		userRepo.findProfileById(userId),
	]);

	if (!account) throw new AppError("User not found", 404);

	return { account, profile };
}

/**
 * Update profile fields (username, email, password, country).
 */
export async function updateProfile(userId, data) {
	const { username, email, currentPassword, newPassword, country } = data;

	const accountUpdates = {};
	const profileUpdates = {};

	// ── Username uniqueness ──
	if (username) {
		const existing = await userRepo.findAccountByUsername(username);
		if (existing && String(existing._id) !== String(userId)) {
			throw new AppError("Username is already taken", 409);
		}
		accountUpdates.username = username;
	}

	// ── Email uniqueness ──
	if (email) {
		const existing = await userRepo.findAccountByEmail(email);
		if (existing && String(existing._id) !== String(userId)) {
			throw new AppError("Email is already in use", 409);
		}
		accountUpdates.email = email.toLowerCase();
	}

	// ── Password change ──
	if (newPassword) {
		if (!currentPassword) {
			throw new AppError("Current password is required to set a new password", 400);
		}

		const account = await userRepo.findAccountByIdWithPassword(userId);
		if (!account) throw new AppError("User not found", 404);

		const isMatch = await bcrypt.compare(currentPassword, account.password);
		if (!isMatch) {
			throw new AppError("Current password is incorrect", 401);
		}

		accountUpdates.password = await bcrypt.hash(newPassword, 12);
	}

	// ── Country ──
	if (country !== undefined) {
		profileUpdates.country = country;
	}

	// Persist
	const promises = [];
	if (Object.keys(accountUpdates).length) {
		promises.push(userRepo.updateAccount(userId, accountUpdates));
	}
	if (Object.keys(profileUpdates).length) {
		promises.push(userRepo.updateProfile(userId, profileUpdates));
	}

	await Promise.all(promises);

	return getProfile(userId);
}

/**
 * Upload avatar to Cloudinary and persist URL.
 */
export async function uploadAvatar(userId, fileBuffer) {
	if (!fileBuffer || !fileBuffer.length) {
		throw new AppError("No file provided", 400);
	}

	const url = await uploadToCloudinary(fileBuffer, "tictactoang/avatars");
	await userRepo.updateProfile(userId, { avatar: url });

	return { avatar: url };
}