import User from "../users/user.model.js";

export const findAllPlayers = () =>
  User.find({ role: "player" })
    .select("username email country avatar isPremium isActive createdAt")
    .sort({ createdAt: -1 })
    .lean();

export const findUserById = (id) => User.findById(id);

export const updateUserStatus = (id, isActive) =>
  User.findByIdAndUpdate(id, { isActive }, { new: true }).select("-password");
