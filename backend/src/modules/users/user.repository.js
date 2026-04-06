import User from "./user.model.js";

export const findById = (id) => User.findById(id).select("-password");

export const findByIdWithPassword = (id) => User.findById(id);

export const findByEmail = (email) => User.findOne({ email });

export const updateUser = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true }).select("-password");

export const saveUser = async (user) => {
  await user.save();
  const { password, ...userData } = user.toObject();
  return userData;
};

// --- Cross-module operations (exposed via user.facade.js) ---

export const findUserForAuth = (id) =>
  User.findById(id).select("role isActive");

export const findAllPlayers = () =>
  User.find({ role: "player" })
    .select("username email country avatar isPremium isActive createdAt")
    .sort({ createdAt: -1 })
    .lean();

export const setActiveStatus = (id, isActive) =>
  User.findByIdAndUpdate(id, { isActive }, { new: true }).select("-password");

export const updateWalletBalance = (id, balance) =>
  User.findByIdAndUpdate(id, { walletBalance: balance }, { new: true });

export const setPremiumStatus = (id, isPremium) =>
  User.findByIdAndUpdate(id, { isPremium }, { new: true });
