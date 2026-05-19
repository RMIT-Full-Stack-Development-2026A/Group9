import Transaction from "../models/transaction.model.js";
import * as userInterface from "../../user/interface/user.interface.js";

// ── Transaction Queries ───────────────────────────────────────────────
export const createTransaction = (data) =>
	Transaction.create(data);

export const findTransactionById = (id) =>
	Transaction.findById(id).lean();

export const updateTransactionStatus = (id, status) =>
	Transaction.findByIdAndUpdate(id, { $set: { status } }, { returnDocument: "after" }).lean();

export const findLatestPendingSubscriptionBySessionId = (sessionId) =>
	Transaction.findOne({
		type: "subscription",
		status: "pending",
		description: new RegExp(`Stripe checkout ${sessionId}$`),
	})
		.sort({ createdAt: -1 })
		.lean();

export const findTransactionsByUser = (userId) =>
	Transaction.find({ userId }).sort({ createdAt: -1 }).lean();

// ── Wallet / Premium Queries (delegated to user module) ────────────────
export const getWalletBalance = (userId) => userInterface.getWalletBalance(userId);

export const addToWallet = (userId, amount) => userInterface.addToWallet(userId, amount);

export const deductFromWallet = (userId, amount) => userInterface.deductFromWallet(userId, amount);

export const setPremiumUntil = (userId, date) => userInterface.setPremiumUntil(userId, date);

export const getPremiumUntil = (userId) => userInterface.getPremiumUntil(userId);
