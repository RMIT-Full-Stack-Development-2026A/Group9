import * as userRepository from "./user.repository.js";
import * as gameInterface from "../game/game.interface.js";

export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateProfile = async (userId, updateData) => {
  const user = await userRepository.findByIdWithPassword(userId);
  if (!user) throw new Error("User not found");

  if (updateData.currentPassword && !updateData.newPassword) {
    throw new Error("New password is required");
  }

  if (updateData.email && updateData.email !== user.email) {
    const existing = await userRepository.findByEmail(updateData.email);
    if (existing) throw new Error("Email already in use");
    user.email = updateData.email;
  }

  if (updateData.username) user.username = updateData.username;
  if (updateData.country !== undefined) user.country = updateData.country;

  if (updateData.newPassword) {
    if (!updateData.currentPassword) {
      throw new Error("Current password is required");
    }
    const isMatch = await user.comparePassword(updateData.currentPassword);
    if (!isMatch) throw new Error("Current password is incorrect");
    user.password = updateData.newPassword;
  }

  return userRepository.saveUser(user);
};

export const updateAvatar = async (userId, avatarPath) => {
  return userRepository.updateUser(userId, { avatar: avatarPath });
};

export const getGameHistory = async (userId, query) => {
  return gameInterface.getGameHistoryForUser(userId, query);
};

// --- Cross-module operations (exposed via user.interface.js) ---

export const getUserById = (id) => userRepository.findById(id);

export const getUserForAuth = (id) => userRepository.findUserForAuth(id);

export const findAllPlayers = () => userRepository.findAllPlayers();

export const findByEmail = (email) => userRepository.findByEmail(email);

export const findByUsername = (username) => userRepository.findByUsername(username);

export const findByEmailOrUsername = (identifier) =>
  userRepository.findByEmailOrUsername(identifier);

export const createUser = (userData) => userRepository.createUser(userData);

export const setActiveStatus = (id, isActive) =>
  userRepository.setActiveStatus(id, isActive);

export const setPremiumStatus = (id, isPremium) =>
  userRepository.setPremiumStatus(id, isPremium);

export const updateWalletBalance = (id, balance) =>
  userRepository.updateWalletBalance(id, balance);
