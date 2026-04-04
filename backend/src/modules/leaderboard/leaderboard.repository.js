import Rank from "./rank.model.js";

export const findAllRanks = (sortField = "wins", sortOrder = -1, limit = 50) => {
  return Rank.find()
    .populate("userId", "username avatar country isPremium")
    .sort({ [sortField]: sortOrder })
    .limit(limit);
};

export const findRankByUserId = (userId) => {
  return Rank.findOne({ userId });
};

export const upsertRank = (userId, update) => {
  return Rank.findOneAndUpdate(
    { userId },
    { ...update, updatedAt: Date.now() },
    { upsert: true, new: true }
  );
};