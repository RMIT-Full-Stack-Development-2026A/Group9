import * as leaderboardService from "./leaderboard.service.js";
import { toRankDTO } from "./leaderboard.dto.js";

export const getLeaderboard = async (req, res) => {
  try {
    const { sortBy } = req.query;
    const ranks = await leaderboardService.getLeaderboard(sortBy);
    res.json(ranks.map(toRankDTO));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyRank = async (req, res) => {
  try {
    const rank = await leaderboardService.getPlayerRank(req.userId);
    res.json(rank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};