/*
	apiRoutes.js
	- Single source-of-truth for client-side API endpoints. Import these
	- constants in service modules so that URLs are discoverable and changeable
	- from one location (helps when the backend path changes or when adding
	- common query params, versioning, or prefixes).
*/

// Helper to keep the multiplayer room routes readable and avoid repeating
// the path construction logic in multiple places.
const ROOMS = (roomId) => `/api/multiplayer/rooms/${roomId}`;

export const API_ROUTES = {
	// Authentication endpoints: login/register
	auth: {
		login: "/api/auth/login",
		register: "/api/auth/register",
	},

	// User-focused endpoints: profile, avatar upload, and game history
	users: {
		profile: "/api/users/profile",
		avatar: "/api/users/profile/avatar",
		gameHistory: "/api/users/game-history",
	},

	// Game session endpoints: create/list sessions, submit moves, AI moves,
	// abort ongoing sessions and fetch replays for a session id.
	game: {
		sessions: "/api/game/sessions",
		move: "/api/game/sessions/move",
		aiMove: "/api/game/sessions/ai-move",
		abort: "/api/game/sessions/abort",
		replay: (sessionId) => `/api/game/sessions/${sessionId}/replay`,
	},

	// Multiplayer endpoints: listing rooms, active rooms, and helpers for
	// actions that target a specific room id (join/close). The use of
	// function-valued routes (e.g. `roomById`) prevents accidental string
	// concatenation bugs at call sites.
	multiplayer: {
		rooms: "/api/multiplayer/rooms",
		roomsActive: "/api/multiplayer/rooms/active",
		roomById: (roomId) => ROOMS(roomId),
		joinRoom: (roomId) => `${ROOMS(roomId)}/join`,
		closeRoom: (roomId) => `${ROOMS(roomId)}/close`,
	},

	// Admin endpoints: metrics, player listing and moderation, broadcast, and
	// audit logs. These are intentionally separated so client code can
	// clearly express admin-only operations.
	admin: {
		metrics: "/api/admin/metrics",
		players: "/api/admin/players",
		togglePlayer: (playerId) => `/api/admin/players/${playerId}/toggle-status`,
		broadcast: "/api/admin/broadcast",
		auditLogs: "/api/admin/audit-logs",
	},

	// Billing endpoints: wallet management, deposits, subscription actions,
	// stripe checkout initiation and transaction listing. Keep payment-related
	// routes grouped to simplify usage from payment UI/service modules.
	billing: {
		wallet: "/api/billing/wallet",
		deposit: "/api/billing/wallet/deposit",
		subscribeWallet: "/api/billing/subscribe/wallet",
		stripeCheckout: "/api/billing/checkout/stripe",
		transactions: "/api/billing/transactions",
	},
};
