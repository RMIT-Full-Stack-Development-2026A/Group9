import * as gameService from "./game.service.js";

/**
 * Game module interface — the only entry point for other modules.
 * Other modules must NOT import game services, repositories, models, or DTOs directly.
 * (Architecture requirement A.3.1)
 */

export const getGameHistoryForUser = (userId, query) => {
  return gameService.getGameHistoryForUser(userId, query);
};

/**
 * Find completed sessions for a specific player.
 * Used by the leaderboard module to recalculate rank stats.
 */
export const getCompletedSessionsForUser = (userId) => {
  return gameService.getCompletedSessionsForUser(userId);
};

/**
 * Find all online game sessions.
 * Used by the admin module to list/manage game rooms.
 */
export const getOnlineGameRooms = (filter = {}) => {
  return gameService.getOnlineGameRooms(filter);
};

/**
 * Find a single game session by ID.
 * Used by the admin module to inspect or close a room.
 */
export const getGameSessionById = (id) => {
  return gameService.getGameSessionById(id);
};

/**
 * Close (abort) a game session.
 * Used by the admin module to forcefully end an active room.
 */
export const closeGameSession = (id) => {
  return gameService.closeGameSession(id);
};
