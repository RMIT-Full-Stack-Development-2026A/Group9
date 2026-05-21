import Transaction from "../models/transaction.model.js";

// ── Transaction Queries ───────────────────────────────────────────────
// Create and persist a new transaction document.
export const createTransaction = (data) =>
	Transaction.create(data);

// Look up a single transaction by id and return a plain object.
export const findTransactionById = (id) =>
	Transaction.findById(id).lean();

// Update transaction status and return the updated plain object.
export const updateTransactionStatus = (id, status) =>
	Transaction.findByIdAndUpdate(id, { $set: { status } }, { returnDocument: "after" }).lean();

// Find the latest pending Stripe subscription transaction for a session id.
export const findLatestPendingSubscriptionBySessionId = (sessionId) =>
	Transaction.findOne({
		type: "subscription",
		status: "pending",
		description: new RegExp(`Stripe checkout ${sessionId}$`),
	})
		.sort({ createdAt: -1 })
		.lean();

// Return a user's transaction history sorted from newest to oldest.
export const findTransactionsByUser = (userId) =>
	Transaction.find({ userId }).sort({ createdAt: -1 }).lean();
