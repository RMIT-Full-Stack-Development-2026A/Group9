import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		country: { type: String, default: "" },
		role: { type: String, enum: ["player", "admin"], default: "player" },
		isActive: { type: Boolean, default: true },
		avatar: { type: String, default: "" },
		premiumUntil: { type: Date, default: null },
		walletBalance: { type: Number, default: 0 },
		failedLoginAttempts: { type: Number, default: 0 },
		lastFailedLogin: { type: Date, default: null },
	},
	{
		timestamps: true,
		collection: process.env.MONGO_USER_COLLECTION || "Users_Homepage",
	}
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;