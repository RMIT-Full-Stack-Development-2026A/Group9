import * as userRepository from "./user.repository.js";
import * as gameInterface from "../game/game.interface.js";

export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateProfile = async (userId, updateData) => {
  // findByIdWithPassword returns a UserAccount Mongoose document
  const account = await userRepository.findByIdWithPassword(userId);
  if (!account) throw new Error("User not found");

  if (updateData.currentPassword && !updateData.newPassword) {
    throw new Error("New password is required");
  }

  // Account-level fields
  if (updateData.email && updateData.email !== account.email) {
    const existing = await userRepository.findByEmail(updateData.email);
    if (existing) throw new Error("Email already in use");
    account.email = updateData.email;
  }

  if (updateData.username) account.username = updateData.username;

  if (updateData.newPassword) {
    if (!updateData.currentPassword) {
      throw new Error("Current password is required");
    }
    const isMatch = await account.comparePassword(updateData.currentPassword);
    if (!isMatch) throw new Error("Current password is incorrect");
    account.password = updateData.newPassword;
  }

  // Save account changes (password hash happens in the pre-save hook)
  if (account.isModified()) {
    await account.save();
  }

  // Profile-level fields — update separately so account is never touched
  const profileFields = {};
  if (updateData.country !== undefined) profileFields.country = updateData.country;
  if (Object.keys(profileFields).length > 0) {
    await userRepository.updateProfileFields(userId, profileFields);
  }

  return userRepository.findById(userId);
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

export const getUsersByIds = (ids) => userRepository.findByIds(ids);
