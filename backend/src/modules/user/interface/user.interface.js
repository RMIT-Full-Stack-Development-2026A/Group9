import * as userService from '../services/user.service.js';
import {
	createUserResponseDTO,
	createProfileDTO,
} from '../dto/user.dto.js';

// Expose public functions that return DTOs
export const getProfile = async (...args) => {
	const user = await userService.getProfile(...args);
	return createProfileDTO(user);
};

export const updateProfile = async (...args) => {
	const user = await userService.updateProfile(...args);
	return createProfileDTO(user);
};

export const updateAvatar = async (...args) => {
	const user = await userService.updateAvatar(...args);
	return createUserResponseDTO(user);
};

export const getGameHistory = async (...args) => {
	// Game history is likely an array of sessions, not a user
	return userService.getGameHistory(...args);
};
