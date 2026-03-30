import User from "./user.model.js";

export const findById = (id) => User.findById(id).select("-password");

export const findByIdWithPassword = (id) => User.findById(id);

export const findByEmail = (email) => User.findOne({ email });

export const updateUser = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true }).select("-password");
