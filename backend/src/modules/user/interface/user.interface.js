import * as userService from '../services/user.service.js';

// Example: Expose a public function for other modules
export const getUserProfile = (userId) => {
	return userService.getUserProfile(userId);
};
