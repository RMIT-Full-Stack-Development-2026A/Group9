import * as adminService from '../services/admin.service.js';

// Example: Expose a public function for other modules
export const getAdminDashboard = (adminId) => {
	return adminService.getAdminDashboard(adminId);
};
