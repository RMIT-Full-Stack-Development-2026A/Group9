import { http } from "../../../shared/utils/http.helper.js";
import { API_ROUTES } from "../../../config/apiRoutes.js";

export const adminService = {
	getMetrics: async () => http.get(API_ROUTES.admin.metrics),

	getPlayers: async () => http.get(API_ROUTES.admin.players),

	togglePlayerStatus: async (playerId) =>
		http.put(API_ROUTES.admin.togglePlayer(playerId)),

	broadcastMessage: async (message) =>
		http.post(API_ROUTES.admin.broadcast, { message }),

	getAuditLogs: async () => http.get(API_ROUTES.admin.auditLogs),
};
