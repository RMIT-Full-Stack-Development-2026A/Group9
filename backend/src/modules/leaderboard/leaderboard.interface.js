import * as leaderboardService from "./leaderboard.service.js";

/**
 * Leaderboard module interface — the only entry point for other modules.
 * Other modules must NOT import leaderboard services, repositories, or models directly.
 * (Architecture requirement A.3.1)
 */

export const getLeaderboard = (sortBy) => leaderboardService.getLeaderboard(sortBy);

export const getPlayerRank = (userId) => leaderboardService.getPlayerRank(userId);

export const recalculateRank = (userId) => leaderboardService.recalculateRank(userId);
