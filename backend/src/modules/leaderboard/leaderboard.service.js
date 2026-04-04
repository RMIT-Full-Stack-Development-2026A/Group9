import * as repo from "./leaderboard.repository.js";
import GameSession from "../game/gameSession.model.js";

export const getLeaderboard = async (sortBy = "wins") => {
  const allowed = ["wins", "winRate", "totalGames"];
  const sortField = allowed.includes(sortBy) ? sortBy : "wins";
  const ranks = await repo.findAllRanks(sortField, -1, 50);
  return ranks;
};

export const getPlayerRank = async (userId) => {
  const rank = await repo.findRankByUserId(userId);
  if (!rank) return { wins: 0, losses: 0, draws: 0, totalGames: 0, winRate: 0 };
  return rank;
};

/**
 * Recalculate rank stats for a user from their game sessions.
 * Called after a game ends.
 */
export const recalculateRank = async (userId) => {
  const sessions = await GameSession.find({
    players: userId,
    result: { $in: ["win", "draw"] },
  });

  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (const s of sessions) {
    if (s.result === "draw") {
      draws++;
    } else if (s.winner && s.winner.toString() === userId.toString()) {
      wins++;
    } else {
      losses++;
    }
  }

  // Also count losses from sessions where result is "win" but user is not the winner
  const allSessions = await GameSession.find({
    players: userId,
    result: "win",
    winner: { $ne: userId },
  });
  losses += allSessions.length;

  // Subtract the already-counted losses to avoid double-count
  // Actually let's simplify: count all completed sessions
  const completed = await GameSession.find({
    players: userId,
    result: { $in: ["win", "draw"] },
  });

  wins = 0;
  losses = 0;
  draws = 0;
  for (const s of completed) {
    if (s.result === "draw") draws++;
    else if (s.winner && s.winner.toString() === userId.toString()) wins++;
    else losses++;
  }

  const totalGames = wins + losses + draws;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return repo.upsertRank(userId, { wins, losses, draws, totalGames, winRate });
};