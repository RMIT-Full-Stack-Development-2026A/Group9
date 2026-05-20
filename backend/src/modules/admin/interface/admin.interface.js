import { adminService } from '../services/admin.service.js';
import { adminDto } from '../dto/admin.dto.js';

export const getMetrics = async (...args) => {
	const metrics = await adminService.getMetrics(...args);
	return adminDto.toMetricsResponse(metrics);
};

export const getPlayers = async (...args) => {
	return await adminService.getPlayers(...args);
};

export const togglePlayerStatus = async (...args) => {
	return await adminService.togglePlayerStatus(...args);
};
