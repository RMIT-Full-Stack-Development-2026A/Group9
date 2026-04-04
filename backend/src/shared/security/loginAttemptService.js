/**
 * In-memory login attempt tracker for brute-force protection.
 * Blocks an account after 5 failed attempts within 60 seconds (Req 2.2.1).
 */
const attempts = new Map(); // key: email/username, value: { count, firstAttemptTime }

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 60 seconds

export const recordFailedAttempt = (identifier) => {
  const now = Date.now();
  const entry = attempts.get(identifier);

  if (!entry || now - entry.firstAttemptTime > WINDOW_MS) {
    attempts.set(identifier, { count: 1, firstAttemptTime: now });
    return;
  }

  entry.count += 1;
  attempts.set(identifier, entry);
};

export const isBlocked = (identifier) => {
  const entry = attempts.get(identifier);
  if (!entry) return false;

  const now = Date.now();
  if (now - entry.firstAttemptTime > WINDOW_MS) {
    attempts.delete(identifier);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
};

export const clearAttempts = (identifier) => {
  attempts.delete(identifier);
};

export const getRemainingLockTime = (identifier) => {
  const entry = attempts.get(identifier);
  if (!entry) return 0;
  const elapsed = Date.now() - entry.firstAttemptTime;
  if (elapsed > WINDOW_MS) return 0;
  return Math.ceil((WINDOW_MS - elapsed) / 1000);
};
