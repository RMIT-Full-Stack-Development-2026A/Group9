import Rank from "./rank.model.js";

export const findAllRanks = (sortField = "wins", sortOrder = -1, limit = 50) => {
  // Populate only username from UserAccount — avatar/country/isPremium come from
  // a separate profile enrichment step in the service (via user interface, A.3.1).
  return Rank.find()
    .populate("userId", "username")
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