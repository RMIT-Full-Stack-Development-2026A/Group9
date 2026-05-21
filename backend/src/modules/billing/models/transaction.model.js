/**
 * Transaction schema for wallet deposits and premium purchases.
 * Keeps only database shape and validation rules; business logic lives in
 * the billing service layer.
 */

import mongoose from "mongoose";

// MongoDB schema describing a billing transaction record.
const transactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserAccount",
			required: true,
			index: true,
		},
		type: {
			type: String,
			enum: ["deposit", "subscription"],
			required: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
			index: true,
		},
		description: {
			type: String,
			default: "",
			trim: true,
		},
	},
	{
		timestamps: true,
		collection: process.env.MONGO_TRANSACTION_COLLECTION || "Transactions",
	}
);

// Index user transaction history by newest first.
transactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction =
	mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default Transaction;