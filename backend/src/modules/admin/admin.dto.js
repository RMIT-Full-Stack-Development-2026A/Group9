/**
 * Admin DTOs — present only necessary data in responses (A.3.2).
 * Excludes sensitive fields like password, walletBalance from player listings.
 */

export const toPlayerListDTO = (player) => {
  const obj = player.toObject ? player.toObject() : player;
  return {
    _id: obj._id,
    username: obj.username,
    email: obj.email,
    country: obj.country,
    avatar: obj.avatar,
    role: obj.role,
    isPremium: obj.isPremium,
    isActive: obj.isActive,
    createdAt: obj.createdAt,
    // walletBalance intentionally excluded (A.3.2)
    // password intentionally excluded (A.3.2)
  };
};
