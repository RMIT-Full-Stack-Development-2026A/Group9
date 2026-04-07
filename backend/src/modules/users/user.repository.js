import mongoose from "mongoose";
import UserAccount from "./userAccount.model.js";
import UserProfile from "./userProfile.model.js";

// --- Internal helper ---
// Merges a lean UserAccount doc with a lean UserProfile doc into one plain object.
// The shared _id from UserAccount is kept as the canonical user _id.
const merge = (account, profile) => {
  const { __v: _av, ...acc } = account;
  const { _id: _pid, __v: _pv, ...prf } = profile || {};
  return { ...acc, ...prf };
};

// --- Standard user operations ---

export const findById = async (id) => {
  const [account, profile] = await Promise.all([
    UserAccount.findById(id).select("-password").lean(),
    UserProfile.findById(id).lean(),
  ]);
  if (!account) return null;
  return merge(account, profile);
};

export const findByIdWithPassword = (id) => UserAccount.findById(id);

export const findByEmail = (email) => UserAccount.findOne({ email });

export const findByUsername = (username) => UserAccount.findOne({ username });

export const findByEmailOrUsername = (identifier) =>
  UserAccount.findOne({ $or: [{ email: identifier }, { username: identifier }] });

export const createUser = async (userData) => {
  const { country, avatar, isPremium, walletBalance, ...accountData } = userData;
  const accountId = new mongoose.Types.ObjectId();
  await Promise.all([
    UserAccount.create({ _id: accountId, ...accountData }),
    UserProfile.create({ _id: accountId, country: country || "", avatar: avatar || "" }),
  ]);
  return findById(accountId);
};

export const updateUser = async (id, data) => {
  const { country, avatar, isPremium, walletBalance, ...accountFields } = data;
  const profileFields = Object.fromEntries(
    Object.entries({ country, avatar, isPremium, walletBalance }).filter(([, v]) => v !== undefined)
  );
  const promises = [];
  if (Object.keys(accountFields).length > 0) {
    promises.push(UserAccount.findByIdAndUpdate(id, accountFields, { new: true }));
  }
  if (Object.keys(profileFields).length > 0) {
    promises.push(UserProfile.findByIdAndUpdate(id, profileFields, { new: true }));
  }
  await Promise.all(promises);
  return findById(id);
};

// Called by user.service.js updateProfile after mutating the account document in-place.
export const saveUser = async (account) => {
  await account.save();
  return findById(account._id);
};

export const updateProfileFields = (id, fields) =>
  UserProfile.findByIdAndUpdate(id, fields, { new: true, upsert: true });

// --- Cross-module operations (exposed via user.interface.js) ---

// Auth middleware: needs role + isActive only — no profile query needed.
export const findUserForAuth = (id) =>
  UserAccount.findById(id).select("role isActive");

export const findAllPlayers = async () => {
  const accounts = await UserAccount.find({ role: "player" })
    .select("username email isActive role createdAt")
    .lean();
  const ids = accounts.map((a) => a._id);
  const profiles = await UserProfile.find({ _id: { $in: ids } })
    .select("country avatar isPremium walletBalance")
    .lean();
  const profileMap = Object.fromEntries(profiles.map((p) => [p._id.toString(), p]));
  return accounts.map((a) => merge(a, profileMap[a._id.toString()]));
};

// Batch fetch for use by other modules (e.g. leaderboard enrichment).
export const findByIds = async (ids) => {
  const [accounts, profiles] = await Promise.all([
    UserAccount.find({ _id: { $in: ids } }).select("username").lean(),
    UserProfile.find({ _id: { $in: ids } }).select("country avatar isPremium").lean(),
  ]);
  const profileMap = Object.fromEntries(profiles.map((p) => [p._id.toString(), p]));
  return accounts.map((a) => merge(a, profileMap[a._id.toString()]));
};

export const setActiveStatus = (id, isActive) =>
  UserAccount.findByIdAndUpdate(id, { isActive }, { new: true });

export const updateWalletBalance = (id, balance) =>
  UserProfile.findByIdAndUpdate(id, { walletBalance: balance }, { new: true, upsert: true });

export const setPremiumStatus = (id, isPremium) =>
  UserProfile.findByIdAndUpdate(id, { isPremium }, { new: true, upsert: true });

