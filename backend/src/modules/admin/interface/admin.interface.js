import { adminService } from '../services/admin.service.js';
import { adminDto } from '../dto/admin.dto.js';

export const getMetrics = async (...args) => {
	// Thin interface layer: forward to service and adapt response via DTO
	const metrics = await adminService.getMetrics(...args);
	return adminDto.toMetricsResponse(metrics);
};

export const getPlayers = async (...args) => {
	// Note: adminService already returns DB documents; interface ensures
	// final mapping is consistent with the DTO contract.
	const players = await adminService.getPlayers(...args);
	return players.map(adminDto.toPlayerResponse);
};

export const togglePlayerStatus = async (...args) => {
	// Toggle status returns the updated DB shape; normalize to DTO
	const user = await adminService.togglePlayerStatus(...args);
	return adminDto.toPlayerResponse(user);
};
