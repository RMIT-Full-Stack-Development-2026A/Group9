/**
 * USER ACCOUNT MODEL
 * Security-split identity model (credentials + access state only).
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		// Identity
		username: { type: String, required: true, trim: true, match: /^[A-Za-z0-9_-]+$/ },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
		password: { type: String, required: true, select: false },

		// Access control
		role: { type: String, enum: ["player", "admin"], default: "player" },
		isActive: { type: Boolean, default: true },
	},
	{
		timestamps: { createdAt: true, updatedAt: false },
		collection: process.env.MONGO_USER_ACCOUNT_COLLECTION || "UserAccounts",
	}
);

const UserAccount =
	mongoose.models.UserAccount || mongoose.model("UserAccount", userSchema);

export default UserAccount;