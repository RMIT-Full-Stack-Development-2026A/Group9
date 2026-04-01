import * as userRepository from "./user.repository.js";
import * as gameFacade from "../game/game.facade.js";

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
  return gameFacade.getGameHistoryForUser(userId, query);
};
