const revokedTokenMap = new Map();

export function revokeTokenJti(jti, expSeconds) {
  if (!jti || !expSeconds) {
    return;
  }

  const expireAtMs = expSeconds * 1000;
  revokedTokenMap.set(jti, expireAtMs);
}

export function isTokenRevoked(jti) {
  if (!jti) {
    return false;
  }

  cleanupExpiredRevocations();
  return revokedTokenMap.has(jti);
}

function cleanupExpiredRevocations() {
  const now = Date.now();
  for (const [jti, expMs] of revokedTokenMap.entries()) {
    if (expMs <= now) {
      revokedTokenMap.delete(jti);
    }
  }
}
