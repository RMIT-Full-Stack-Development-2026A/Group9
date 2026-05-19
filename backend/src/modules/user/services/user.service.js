import bcrypt from "bcryptjs";
import * as userRepository from "../repositories/user.repository.js";
import UserProfile from "../models/userProfile.model.js";
import * as gameInterface from "../../game/interface/game.interface.js";

// ── Profile operations ─────────────────────────────────────────────────

export const getProfile = async (userId) => {
	const account = await userRepository.findByIdLean(userId);
	if (!account) throw new Error("User not found");

	const profile = await userRepository.getProfileById(userId);
	return {
		...account,
		avatar: profile?.avatar || "",
		country: profile?.country || "",
		premiumUntil: profile?.premiumUntil || null,
	};
};

export const updateProfile = async (userId, updateData) => {
	const user = await userRepository.findByIdWithPassword(userId);
	if (!user) throw new Error("User not found");

	if (updateData.email && updateData.email !== user.email) {
		const existing = await userRepository.findByEmail(updateData.email);
		if (existing) throw new Error("Email already in use");
		user.email = updateData.email;
	}

	if (updateData.username) user.username = updateData.username;
	if (updateData.country !== undefined) {
		user.country = updateData.country;
		await UserProfile.findByIdAndUpdate(
			userId,
			{ country: updateData.country },
			{ new: true, upsert: true }
		);
	}

	if (updateData.newPassword) {
		if (!updateData.currentPassword) {
			throw new Error("Current password is required");
		}
		const isMatch = await bcrypt.compare(updateData.currentPassword, user.password);
		if (!isMatch) throw new Error("Current password is incorrect");
		user.password = await bcrypt.hash(updateData.newPassword, 10);
	}

	await user.save();

	const profile = await userRepository.getProfileById(userId);
	const userData = user.toObject();
	userData.avatar = profile?.avatar || "";
	userData.country = profile?.country || "";
	userData.premiumUntil = profile?.premiumUntil || null;
	delete userData.password;
	return userData;
};

export const updateAvatar = async (userId, avatarPath) => {
	await UserProfile.findByIdAndUpdate(
		userId,
		{ avatar: avatarPath },
		{ new: true, upsert: true }
	);
	return getProfile(userId);
};

// ── Auth-oriented operations ───────────────────────────────────────────

const mergeAccountAndProfile = (account, profile) => {
	if (!account) return null;
	return {
		...account,
		premiumUntil: profile?.premiumUntil ?? account?.premiumUntil ?? null,
		avatar: profile?.avatar ?? account?.avatar ?? "",
		country: profile?.country ?? account?.country ?? "",
		walletBalance: Number(profile?.walletBalance ?? account?.walletBalance ?? 0),
	};
};

export const findUserByEmail = async (email) => {
	const account = await userRepository.findByIdentifier(email, "email");
	if (!account) return null;
	const profile = await userRepository.getProfileById(account._id);
	return mergeAccountAndProfile(account, profile);
};

export const findUserByIdentifier = async (identifier, loginType = "email") => {
	const account = await userRepository.findByIdentifier(identifier, loginType);
	if (!account) return null;
	const profile = await userRepository.getProfileById(account._id);
	return mergeAccountAndProfile(account, profile);
};

export const findUserById = async (userId) => {
	const account = await userRepository.findByIdLeanWithPassword(userId);
	if (!account) return null;
	const profile = await userRepository.getProfileById(userId);
	return mergeAccountAndProfile(account, profile);
};

export const createUser = async (payload) => {
	const { country, avatar, ...accountData } = payload;
	const createdAccount = await userRepository.createAccount(accountData);
	await userRepository.createProfile({ _id: createdAccount._id, country, avatar });

	const account = createdAccount.toObject();
	const profile = await userRepository.getProfileById(createdAccount._id);
	return mergeAccountAndProfile(account, profile);
};

export const updateLoginMetadata = async (userId, updateData) => {
	return userRepository.updateUserField(userId, updateData);
};

// ── Wallet / Premium operations ────────────────────────────────────────

export const getWalletBalance = (userId) => userRepository.getWalletBalance(userId);

export const addToWallet = (userId, amount) => userRepository.addToWallet(userId, amount);

export const deductFromWallet = (userId, amount) => userRepository.deductFromWallet(userId, amount);

export const setPremiumUntil = (userId, date) => userRepository.setPremiumUntil(userId, date);

export const getPremiumUntil = (userId) => userRepository.getPremiumUntil(userId);

// ── Game history (delegated to game module) ─────────────────────────────

export const getGameHistory = (userId, query) => gameInterface.getGameHistory(userId, query);
