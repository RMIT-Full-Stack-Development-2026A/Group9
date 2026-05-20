import { adminService } from '../services/admin.service.js';
import { adminDto } from '../dto/admin.dto.js';

export const getMetrics = async (...args) => {
	const metrics = await adminService.getMetrics(...args);
	return adminDto.toMetricsResponse(metrics);
};

export const getPlayers = async (...args) => {
	const players = await adminService.getPlayers(...args);
	return players.map(adminDto.toPlayerResponse);
};

export const togglePlayerStatus = async (...args) => {
	const user = await adminService.togglePlayerStatus(...args);
	return adminDto.toPlayerResponse(user);
};
