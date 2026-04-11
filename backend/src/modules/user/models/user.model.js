/**
 * USER ACCOUNT MODEL
 * Security-split identity model (credentials + access state only).
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

        //brute force protection: lock after 5 attempts for 60s
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
    mongoose.models.UserAccount || mongoose.model("User", userSchema, "users");

export default UserAccount;