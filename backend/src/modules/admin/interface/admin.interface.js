import { adminService } from '../services/admin.service.js';
import { adminDto } from '../dto/admin.dto.js';

// Expose public functions that return DTOs for admin features
export const getMetrics = async (...args) => {
	const metrics = await adminService.getMetrics(...args);
	return metrics; // Already DTO formatted
};

export const getPlayers = async (...args) => {
	const players = await adminService.getPlayers(...args);
	return players; // Already DTO formatted
};

export const getRooms = async (...args) => {
	const rooms = await adminService.getRooms(...args);
	return rooms; // Already DTO formatted
};

export const togglePlayerStatus = async (...args) => {
	const user = await adminService.togglePlayerStatus(...args);
	return adminDto.toPlayerResponse(user);
};
