/**
 * In-memory token blacklist for logout / token revocation (Req 2.3.2).
 * In production, use Redis or a database.
 */
const blacklist = new Set();

export const blacklistToken = (token) => {
  blacklist.add(token);
};

export const isTokenBlacklisted = (token) => {
  return blacklist.has(token);
};
