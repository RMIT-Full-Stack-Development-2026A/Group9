/**
 * ============================================================================
 * USER INTERFACE FILE PURPOSE
 * ============================================================================
 * Purpose: Defines the public contract boundary for the User module.
 * Other modules MUST import this file and are BANNED from importing
 * user.service.js or user.repository.js directly.
 */

import * as userService from "../services/user.service.js";

/**
 * Expose secure read-only profile data to other modules.
 * Guaranteed to return `UserDto.toPublicProfileResponse` payload.
 */
export const getPublicProfile = async (userId) => {
	return userService.getPublicProfile(userId);
};
