/**
 * User account model.
 * Stores credentials and access-control state only; profile data lives in UserProfile.
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
        // Identity fields used for login and display.
		username: { type: String, required: true, trim: true, match: /^[A-Za-z0-9_-]+$/ },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
		password: { type: String, required: true, select: false },

        // Access control flags used by auth middleware and admin actions.
        role: { type: String, enum: ["player", "admin"], default: "player" },
        isActive: { type: Boolean, default: true },

        // Brute-force protection fields: lock after repeated failed logins.
        loginAttempts: { 
            type: Number, 
            required: true, 
            default: 0 
        },
        lockUntil: { 
            type: Number
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: process.env.MONGO_USER_ACCOUNT_COLLECTION || "UserAccounts",
    }
);


const UserAccount =
    mongoose.models.UserAccount || mongoose.model("UserAccount", userSchema, "UserAccounts");

export default UserAccount;