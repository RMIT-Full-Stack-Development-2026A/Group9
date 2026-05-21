import { http } from "../../../shared/utils/http.helper.js";
import { API_ROUTES } from "../../../config/apiRoutes.js";

/*
	admin.service.js
	- Thin API wrapper for admin-related backend endpoints. Each function
	- returns the raw promise from the shared `http` helper so callers can
	- inspect `response.data` or handle HTTP errors consistently.
	- Keep this layer minimal: transform responses in the hook or component
	- where UI-specific shaping is required.
*/
export const adminService = {
	// Fetch aggregated metrics used on the dashboard (counts, active sessions)
	getMetrics: async () => http.get(API_ROUTES.admin.metrics),

	// Retrieve a paginated or full list of player accounts for moderation
	getPlayers: async () => http.get(API_ROUTES.admin.players),

	// Toggle player's active/inactive status. The server decides the exact
	// semantics: a single endpoint keeps the client simple (no separate
	// activate/deactivate methods).
	togglePlayerStatus: async (playerId) =>
		http.put(API_ROUTES.admin.togglePlayer(playerId)),

	// Broadcast a one-off site-wide message. Keep payload minimal to avoid
	// coupling the UI to server-side broadcast internals.
	broadcastMessage: async (message) =>
		http.post(API_ROUTES.admin.broadcast, { message }),

	// Retrieve recent admin audit logs for transparency and debugging.
	getAuditLogs: async () => http.get(API_ROUTES.admin.auditLogs),
};
