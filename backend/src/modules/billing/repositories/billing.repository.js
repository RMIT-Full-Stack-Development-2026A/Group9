import Transaction from "../models/transaction.model.js";

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
