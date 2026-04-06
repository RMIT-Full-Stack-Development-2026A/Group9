import * as userRepository from "./user.repository.js";
import { toAuthDTO } from "./user.dto.js";

/**
 * User module interface — the only entry point for other modules.
 * Other modules must NOT import user services, repositories, or models directly.
 * (Architecture requirement A.3.1)
 */

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

export { toAuthDTO };
