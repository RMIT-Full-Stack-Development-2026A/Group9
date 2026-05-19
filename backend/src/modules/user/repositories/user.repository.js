import UserAccount from "../models/user.model.js";
import UserProfile from "../models/userProfile.model.js";

const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const findById = (id) => UserAccount.findById(id).select("-password");

export const findByIdWithPassword = (id) => UserAccount.findById(id).select("+password");

export const findByEmail = (email) => UserAccount.findOne({ email });

export const findByIdentifier = async (identifier, loginType = "email") => {
	const query =
		loginType === "email"
			? { email: String(identifier || "").toLowerCase() }
			: { username: new RegExp(`^${escapeRegex(identifier)}$`, "i") };

	return UserAccount.findOne(query).select("+password").lean();
};

export const findByIdLeanWithPassword = async (userId) => {
	return UserAccount.findById(userId).select("+password").lean();
};

export const findByIdLean = async (userId) => {
	return UserAccount.findById(userId).lean();
};

export const createAccount = async (accountData) => {
	return UserAccount.create(accountData);
};

export const createProfile = async (profileData) => {
	return UserProfile.create(profileData);
};

export const getProfileById = async (userId) => {
	return UserProfile.findById(userId).lean();
};

export const updateUser = (id, data) => UserAccount.findByIdAndUpdate(id, data, { returnDocument: "after" }).select("-password");

export const updateUserField = async (userId, updateData) => {
	return UserAccount.findByIdAndUpdate(
		userId,
		{ $set: updateData },
		{ returnDocument: "after" }
	);
};

export const getWalletBalance = async (userId) => {
	const profile = await UserProfile.findById(userId).select("walletBalance").lean();
	return profile?.walletBalance ?? 0;
};

export const addToWallet = (userId, amount) =>
	UserProfile.findByIdAndUpdate(
		userId,
		{ $inc: { walletBalance: amount } },
		{ returnDocument: "after", runValidators: true }
	).lean();

export const deductFromWallet = (userId, amount) =>
	UserProfile.findByIdAndUpdate(
		userId,
		{ $inc: { walletBalance: -amount } },
		{ returnDocument: "after", runValidators: true }
	).lean();

export const setPremiumUntil = (userId, date) =>
	UserProfile.findByIdAndUpdate(
		userId,
		{ $set: { premiumUntil: date } },
		{ returnDocument: "after", runValidators: true }
	).lean();

export const getPremiumUntil = async (userId) => {
	const profile = await UserProfile.findById(userId).select("premiumUntil").lean();
	return profile?.premiumUntil ?? null;
};
