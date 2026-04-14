import * as userService from '../services/user.service.js';

export const getProfile = (...args) => userService.getProfile(...args);
export const updateProfile = (...args) => userService.updateProfile(...args);
export const updateAvatar = (...args) => userService.updateAvatar(...args);
export const getGameHistory = (...args) => userService.getGameHistory(...args);
