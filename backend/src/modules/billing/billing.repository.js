import Transaction from "./transaction.model.js";

export const createTransaction = (data) => Transaction.create(data);

export const findTransactionsByUser = (userId) =>
  Transaction.find({ userId }).sort({ createdAt: -1 }).lean();