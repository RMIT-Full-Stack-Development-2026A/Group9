import Transaction from "../models/transaction.model.js";
import UserProfile from "../../user/models/userProfile.model.js";

// ── Transaction Queries ───────────────────────────────────────────────
export const createTransaction = (data) =>
	Transaction.create(data);

export const findTransactionById = (id) =>
	Transaction.findById(id).lean();

export const updateTransactionStatus = (id, status) =>
	Transaction.findByIdAndUpdate(id, { $set: { status } }, { returnDocument: "after" }).lean();

export const findTransactionsByUser = (userId) =>
	Transaction.find({ userId }).sort({ createdAt: -1 }).lean();

// ── Wallet / Premium Queries ──────────────────────────────────────────
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