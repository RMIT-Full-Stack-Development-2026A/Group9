import * as repo from "./leaderboard.repository.js";
import * as gameInterface from "../game/game.interface.js";
import * as userInterface from "../users/user.interface.js";

export const getLeaderboard = async (sortBy = "wins") => {
  const allowed = ["wins", "winRate", "totalGames"];
  const sortField = allowed.includes(sortBy) ? sortBy : "wins";
  const ranks = await repo.findAllRanks(sortField, -1, 50);

  // UserAccount only holds username — enrich with profile data (avatar, country, isPremium)
  // via the user interface to avoid cross-module model imports (A.3.1).
  const ids = ranks.map((r) => r.userId?._id).filter(Boolean);
  const profiles = await userInterface.getUsersByIds(ids);
  const profileMap = Object.fromEntries(profiles.map((p) => [p._id.toString(), p]));

  return ranks.map((r) => {
    const rankObj = r.toObject ? r.toObject() : { ...r };
    const accountId = rankObj.userId?._id;
    if (accountId) {
      const profile = profileMap[accountId.toString()] || {};
      rankObj.userId = { ...rankObj.userId, ...profile };
    }
    return rankObj;
  });
};

export const getPlayerRank = async (userId) => {
  const rank = await repo.findRankByUserId(userId);
  if (!rank) return { wins: 0, losses: 0, draws: 0, totalGames: 0, winRate: 0 };
  return rank;
};

/**
 * Recalculate rank stats for a user from their game sessions.
 * Called after a game ends.
 * Uses game interface (A.3.1) instead of direct model access.
 */
export const recalculateRank = async (userId) => {
  const completed = await gameInterface.getCompletedSessionsForUser(userId);

  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (const s of completed) {
    if (s.result === "draw") {
      draws++;
    } else if (s.winner && s.winner._id.toString() === userId.toString()) {
      wins++;
    } else {
      losses++;
    }
  }

  const totalGames = wins + losses + draws;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return repo.upsertRank(userId, { wins, losses, draws, totalGames, winRate });
};