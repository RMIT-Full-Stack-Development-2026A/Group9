import UserAccount from "../models/user.model.js";
import UserProfile from "../models/userProfile.model.js";

// ── Read ──────────────────────────────────────────────────────────────
export const findAccountById = (id) =>
	UserAccount.findById(id).select("-password").lean();

export const findAccountByIdWithPassword = (id) =>
	UserAccount.findById(id).select("+password").lean();

export const findProfileById = (id) =>
	UserProfile.findById(id).lean();

export const findAccountByEmail = (email) =>
	UserAccount.findOne({ email: email.toLowerCase() }).lean();

export const findAccountByUsername = (username) =>
	UserAccount.findOne({ username }).lean();

// ── Write ─────────────────────────────────────────────────────────────
export const updateAccount = (id, fields) =>
	UserAccount.findByIdAndUpdate(id, { $set: fields }, { returnDocument: 'after', runValidators: true })
		.select("-password")
		.lean();

export const updateProfile = (id, fields) =>
	UserProfile.findByIdAndUpdate(id, { $set: fields }, { returnDocument: 'after', runValidators: true })
		.lean();