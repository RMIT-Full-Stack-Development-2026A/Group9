import Transaction from "./transaction.model.js";
import User from "../users/user.model.js";

export const findUserById = (id) => User.findById(id);

export const updateUserWallet = (id, balance) =>
  User.findByIdAndUpdate(id, { walletBalance: balance }, { new: true });

export const setUserPremium = (id, isPremium) =>
  User.findByIdAndUpdate(id, { isPremium }, { new: true });

export const createTransaction = (data) => Transaction.create(data);

export const findTransactionsByUser = (userId) =>
  Transaction.find({ userId }).sort({ createdAt: -1 }).lean();