/**
 * Centralized API route configuration — grouped by business domain (A.2.a).
 * All service files should reference these constants instead of hardcoding URLs.
 */

const ROOMS = (roomId) => `/api/multiplayer/rooms/${roomId}`;

export const API_ROUTES = {
	auth: {
		login: "/api/auth/login",
		register: "/api/auth/register",
	},

	users: {
		profile: "/api/users/profile",
		avatar: "/api/users/profile/avatar",
		gameHistory: "/api/users/game-history",
	},

	game: {
		sessions: "/api/game/sessions",
		move: "/api/game/sessions/move",
		aiMove: "/api/game/sessions/ai-move",
		abort: "/api/game/sessions/abort",
		replay: (sessionId) => `/api/game/sessions/${sessionId}/replay`,
	},

	multiplayer: {
		rooms: "/api/multiplayer/rooms",
		roomsActive: "/api/multiplayer/rooms/active",
		roomById: (roomId) => ROOMS(roomId),
		joinRoom: (roomId) => `${ROOMS(roomId)}/join`,
		closeRoom: (roomId) => `${ROOMS(roomId)}/close`,
	},

	admin: {
		metrics: "/api/admin/metrics",
		players: "/api/admin/players",
		togglePlayer: (playerId) => `/api/admin/players/${playerId}/toggle-status`,
		broadcast: "/api/admin/broadcast",
		auditLogs: "/api/admin/audit-logs",
		rooms: "/api/admin/rooms",
		roomsSearch: "/api/admin/rooms/search",
		closeRoom: (roomId) => `/api/admin/rooms/${roomId}/close`,
	},

	billing: {
		wallet: "/api/billing/wallet",
		deposit: "/api/billing/wallet/deposit",
		subscribeWallet: "/api/billing/subscribe/wallet",
		stripeCheckout: "/api/billing/checkout/stripe",
		transactions: "/api/billing/transactions",
	},
};
