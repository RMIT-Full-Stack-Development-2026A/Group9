import UserAccount from "../models/user.model.js";
import UserProfile from "../models/userProfile.model.js";
import { createProfileDTO, createUserResponseDTO } from "../dto/user.dto.js";

// Escape special characters so a username can be safely used in a case-insensitive regex query.
const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Find an account by id without exposing the password hash.
export const findById = (id) => UserAccount.findById(id).select("-password");

// Find an account by id with password included for auth checks.
export const findByIdWithPassword = (id) => UserAccount.findById(id).select("+password");

// Find an account by exact email address.
export const findByEmail = (email) => UserAccount.findOne({ email });

// Find an account by email or username and include the password hash for login.
export const findByIdentifier = async (identifier, loginType = "email") => {
	const query =
		loginType === "email"
			? { email: String(identifier || "").toLowerCase() }
			: { username: new RegExp(`^${escapeRegex(identifier)}$`, "i") };

	return UserAccount.findOne(query).select("+password").lean();
};

// Return a plain account document with password included.
export const findByIdLeanWithPassword = async (userId) => {
	return UserAccount.findById(userId).select("+password").lean();
};

// Return a plain account document without the password hash.
export const findByIdLean = async (userId) => {
	return UserAccount.findById(userId).lean();
};

// Create a new account document.
export const createAccount = async (accountData) => {
	return UserAccount.create(accountData);
};

// Create a new profile document keyed by the account id.
export const createProfile = async (profileData) => {
	return UserProfile.create(profileData);
};

// Load the profile document for a given user id.
export const getProfileById = async (userId) => {
	return UserProfile.findById(userId).lean();
};

// Update arbitrary account fields and return the updated account.
export const updateUser = (id, data) => UserAccount.findByIdAndUpdate(id, data, { returnDocument: "after" }).select("-password");

// Update account fields using a `$set` patch.
export const updateUserField = async (userId, updateData) => {
	return UserAccount.findByIdAndUpdate(
		userId,
		{ $set: updateData },
		{ returnDocument: "after" }
	);
};

// Read only the wallet balance from the profile document.
export const getWalletBalance = async (userId) => {
	const profile = await UserProfile.findById(userId).select("walletBalance").lean();
	return profile?.walletBalance ?? 0;
};

// Increase the wallet balance and return the updated profile.
export const addToWallet = (userId, amount) =>
	UserProfile.findByIdAndUpdate(
		userId,
		{ $inc: { walletBalance: amount } },
		{ returnDocument: "after", runValidators: true }
	).lean();

// Decrease the wallet balance and return the updated profile.
export const deductFromWallet = (userId, amount) =>
	UserProfile.findByIdAndUpdate(
		userId,
		{ $inc: { walletBalance: -amount } },
		{ returnDocument: "after", runValidators: true }
	).lean();

// Update the premium expiry timestamp and return the updated profile.
export const setPremiumUntil = (userId, date) =>
	UserProfile.findByIdAndUpdate(
		userId,
		{ $set: { premiumUntil: date } },
		{ returnDocument: "after", runValidators: true }
	).lean();

// Upsert a single profile field so avatar/country writes can be reused.
export const updateProfileField = (userId, field, value) =>
	UserProfile.findByIdAndUpdate(
		userId,
		{ $set: { [field]: value } },
		{ returnDocument: "after", upsert: true }
	).lean();

// Read the premium expiry timestamp from the profile document.
export const getPremiumUntil = async (userId) => {
	const profile = await UserProfile.findById(userId).select("premiumUntil").lean();
	return profile?.premiumUntil ?? null;
};

// Convert a profile document into the public profile DTO.
export const formatProfileResponse = (user = {}) => createProfileDTO(user);
// Convert an account/profile document into the public user DTO.
export const formatUserResponse = (user = {}) => createUserResponseDTO(user);
