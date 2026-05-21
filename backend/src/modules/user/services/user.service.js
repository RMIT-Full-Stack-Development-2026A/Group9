import bcrypt from "bcryptjs";
import * as userRepository from "../repositories/user.repository.js";
import * as gameInterface from "../../game/interface/game.interface.js";

// ── Profile operations ─────────────────────────────────────────────────

// Load the user's account document and merge in profile-only fields.
// The returned object is the public profile shape used by the profile page.
export const getProfile = async (userId) => {
	const account = await userRepository.findByIdLean(userId);
	if (!account) throw new Error("User not found");

	const profile = await userRepository.getProfileById(userId);
	return userRepository.formatProfileResponse({
		...account,
		avatar: profile?.avatar || "",
		country: profile?.country || "",
		premiumUntil: profile?.premiumUntil || null,
	});
};

// Update account and profile fields in two places:
// - account collection for username/email/password/login state
// - profile collection for country
// Password changes require the current password to be verified first.
export const updateProfile = async (userId, updateData) => {
	const user = await userRepository.findByIdWithPassword(userId);
	if (!user) throw new Error("User not found");

	if (updateData.email && updateData.email !== user.email) {
		// Prevent duplicate emails before writing the new address.
		const existing = await userRepository.findByEmail(updateData.email);
		if (existing) throw new Error("Email already in use");
		user.email = updateData.email;
	}

	// Username is stored on the account document.
	if (updateData.username) user.username = updateData.username;
	// Country lives in the profile collection, so update both the in-memory
	// account copy and the profile document in the repository.
	if (updateData.country !== undefined) {
		user.country = updateData.country;
		await userRepository.updateProfileField(userId, "country", updateData.country);
	}

	if (updateData.newPassword) {
		// Require the current password so a stolen session cannot silently rotate credentials.
		if (!updateData.currentPassword) {
			throw new Error("Current password is required");
		}
		// Verify the existing password hash before replacing it.
		const isMatch = await bcrypt.compare(updateData.currentPassword, user.password);
		if (!isMatch) throw new Error("Current password is incorrect");
		// Store the new password hash on the account document.
		user.password = await bcrypt.hash(updateData.newPassword, 10);
	}

	// Persist the account-level edits.
	await user.save();

	// Reload profile fields so the response includes the latest avatar/country/premium data.
	const profile = await userRepository.getProfileById(userId);
	const userData = user.toObject();
	userData.avatar = profile?.avatar || "";
	userData.country = profile?.country || "";
	userData.premiumUntil = profile?.premiumUntil || null;
	// Never return the password hash to callers.
	delete userData.password;
	return userRepository.formatProfileResponse(userData);
};

// Update only the avatar field in the profile collection, then re-read the full profile.
export const updateAvatar = async (userId, avatarPath) => {
	await userRepository.updateProfileField(userId, "avatar", avatarPath);
	return getProfile(userId);
};

// ── Auth-oriented operations ───────────────────────────────────────────

const mergeAccountAndProfile = (account, profile) => {
	if (!account) return null;
	// Merge account and profile documents into a single auth-friendly object.
	// This keeps wallet, avatar, country, and premium expiry available during login.
	return {
		...account,
		premiumUntil: profile?.premiumUntil ?? account?.premiumUntil ?? null,
		avatar: profile?.avatar ?? account?.avatar ?? "",
		country: profile?.country ?? account?.country ?? "",
		walletBalance: Number(profile?.walletBalance ?? account?.walletBalance ?? 0),
	};
};

// Look up a user by email and attach profile fields for auth flows.
export const findUserByEmail = async (email) => {
	const account = await userRepository.findByIdentifier(email, "email");
	if (!account) return null;
	const profile = await userRepository.getProfileById(account._id);
	return mergeAccountAndProfile(account, profile);
};

// Look up a user by email or username and attach profile fields for auth flows.
export const findUserByIdentifier = async (identifier, loginType = "email") => {
	const account = await userRepository.findByIdentifier(identifier, loginType);
	if (!account) return null;
	const profile = await userRepository.getProfileById(account._id);
	return mergeAccountAndProfile(account, profile);
};

// Fetch a user by id with password included so auth code can verify credentials.
export const findUserById = async (userId) => {
	const account = await userRepository.findByIdLeanWithPassword(userId);
	if (!account) return null;
	const profile = await userRepository.getProfileById(userId);
	return mergeAccountAndProfile(account, profile);
};

// Create the account document, then create the matching profile document keyed by the same id.
// Returns the merged account/profile object used by the auth response flow.
export const createUser = async (payload) => {
	const { country, avatar, ...accountData } = payload;
	const createdAccount = await userRepository.createAccount(accountData);
	await userRepository.createProfile({ _id: createdAccount._id, country, avatar });

	const account = createdAccount.toObject();
	const profile = await userRepository.getProfileById(createdAccount._id);
	return mergeAccountAndProfile(account, profile);
};

// Persist login metadata such as failed-attempt counters and lock timestamps.
export const updateLoginMetadata = async (userId, updateData) => {
	return userRepository.updateUserField(userId, updateData);
};

// ── Wallet / Premium operations ────────────────────────────────────────

// Read the numeric wallet balance from the user profile document.
export const getWalletBalance = (userId) => userRepository.getWalletBalance(userId);

// Increase the user's wallet balance by the given amount.
export const addToWallet = (userId, amount) => userRepository.addToWallet(userId, amount);

// Decrease the user's wallet balance by the given amount.
export const deductFromWallet = (userId, amount) => userRepository.deductFromWallet(userId, amount);

// Store the next premium expiry timestamp on the profile document.
export const setPremiumUntil = (userId, date) => userRepository.setPremiumUntil(userId, date);

// Read the premium expiry timestamp from the profile document.
export const getPremiumUntil = (userId) => userRepository.getPremiumUntil(userId);

// ── Game history (delegated to game module) ─────────────────────────────

// Delegate game-history lookup to the game module so the user module stays
// focused on account/profile concerns while reusing the game history filter logic.
export const getGameHistory = (userId, query) => gameInterface.getGameHistory(userId, query);
