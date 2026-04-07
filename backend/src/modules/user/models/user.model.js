/**
 * ============================================================================
 * USER MODEL (The Identity & Progress Blueprint)
 * ============================================================================
 * Purpose: This file defines the structure of a "TicTacToang" player in the 
 * database. It tracks everything from login credentials to game performance 
 * and career progression (XP/Levels).
 * * Key Responsibilities:
 * 1. Identity: Storing unique usernames, emails, and hashed passwords.
 * 2. Statistics: Tracking a lifetime count of wins, losses, and draws.
 * 3. Progression: Managing XP (Experience Points) and Level calculations.
 * 4. Social: Storing references to friends or blocked users (optional).
 * * CRITICAL RULE: This is a "Heavy" model. To keep the app fast, we use 
 * 'select: false' for sensitive fields like passwords so they aren't 
 * accidentally sent to the frontend.
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		// Identity
		username: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true, select: false },

		// Access control
		role: { type: String, enum: ["player", "admin"], default: "player" },
		isActive: { type: Boolean, default: true },

		// Account status
		premiumUntil: { type: Date, default: null },

		// Profile
		country: { type: String, default: "" },
		avatar: { type: String, default: "" },

		// Security
		walletBalance: { type: Number, default: 0 },
		failedLoginAttempts: { type: Number, default: 0 },
		lastFailedLogin: { type: Date, default: null },

		// Activity
		lastLoginAt: { type: Date, default: null },
	},
	{
		timestamps: true,
		collection: process.env.MONGO_USER_COLLECTION || "Users_Homepage",
	}
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;