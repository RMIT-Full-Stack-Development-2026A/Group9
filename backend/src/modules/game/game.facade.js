import * as gameService from "./game.service.js";
import * as gameRepository from "./game.repository.js";

/**
 * Game module facade — the only entry point for other modules.
 * Other modules must NOT import game services, repositories, or models directly.
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
  return gameRepository.findSessionsByFilter(
    { players: userId, result: { $in: ["win", "draw"] } },
    { startTime: -1 }
  );
};

/**
 * Find all online game sessions.
 * Used by the admin module to list/manage game rooms.
 */
export const getOnlineGameRooms = (filter = {}) => {
  return gameRepository.findAllRooms(filter);
};

/**
 * Find a single game session by ID.
 * Used by the admin module to inspect or close a room.
 */
export const getGameSessionById = (id) => {
  return gameRepository.findSessionById(id);
};

/**
 * Close (abort) a game session.
 * Used by the admin module to forcefully end an active room.
 */
export const closeGameSession = (id) => {
  return gameRepository.updateSession(id, {
    result: "aborted",
    endTime: new Date(),
  });
};
