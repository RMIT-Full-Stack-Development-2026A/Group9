/**
 * Leaderboard DTOs — present only necessary data in responses (A.3.2).
 */

export const toRankDTO = (rank) => {
  const obj = rank.toObject ? rank.toObject() : rank;
  const user = obj.userId;
  return {
    _id: obj._id,
    wins: obj.wins,
    losses: obj.losses,
    draws: obj.draws,
    totalGames: obj.totalGames,
    winRate: obj.winRate,
    userId: user
      ? {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          country: user.country,
          isPremium: user.isPremium,
          // walletBalance, email, password intentionally excluded (A.3.2)
        }
      : null,
  };
};
