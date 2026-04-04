export const API_BASE_URL = "http://localhost:3000/api";
export const WS_URL = "http://localhost:3000";

export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
};

export const USER_ROUTES = {
  PROFILE: "/users/profile",
  AVATAR: "/users/profile/avatar",
  GAME_HISTORY: "/users/game-history",
};

export const GAME_ROUTES = {
  SESSIONS: "/game/sessions",
  AI_MOVE: "/game/ai-move",
  MOVES: "/game/moves",
};

export const BILLING_ROUTES = {
  WALLET: "/billing/wallet",
  DEPOSIT: "/billing/deposit",
  SUBSCRIBE: "/billing/subscribe",
  TRANSACTIONS: "/billing/transactions",
};

export const ADMIN_ROUTES = {
  PLAYERS: "/admin/players",
  GAME_ROOMS: "/admin/game-rooms",
};

export const MULTIPLAYER_ROUTES = {
  ROOMS: "/multiplayer/rooms",
};

export const LEADERBOARD_ROUTES = {
  LIST: "/leaderboard",
  ME: "/leaderboard/me",
};