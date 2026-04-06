import * as userService from "./user.service.js";

/**
 * User module interface — the only entry point for other modules.
 * Other modules must NOT import user services, repositories, models, or DTOs directly.
 * (Architecture requirement A.3.1)
 */

export const getUserById = (id) => userService.getUserById(id);

export const getUserForAuth = (id) => userService.getUserForAuth(id);

export const findAllPlayers = () => userService.findAllPlayers();

export const findByEmail = (email) => userService.findByEmail(email);

export const findByUsername = (username) => userService.findByUsername(username);

export const findByEmailOrUsername = (identifier) =>
  userService.findByEmailOrUsername(identifier);

export const createUser = (userData) => userService.createUser(userData);

export const setActiveStatus = (id, isActive) =>
  userService.setActiveStatus(id, isActive);

export const setPremiumStatus = (id, isPremium) =>
  userService.setPremiumStatus(id, isPremium);

export const updateWalletBalance = (id, balance) =>
  userService.updateWalletBalance(id, balance);
