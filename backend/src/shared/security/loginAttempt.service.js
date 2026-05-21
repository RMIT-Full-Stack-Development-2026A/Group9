
// Simple in-memory login attempt tracker to mitigate brute-force attacks.
// NOTE: This is intentionally in-memory for simplicity — it will NOT
// survive process restarts and is unsuitable for multi-instance
// deployments unless backed by a shared store (Redis, DB, etc.).
// Data shape: { key: { count, lastAttempt, lockUntil } }
const attempts = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 60 seconds window for counting attempts
const LOCK_TIME_MS = 60 * 1000; // Lock for 60 seconds after threshold reached

// Composite key by identifier (username/email) and IP to provide
// reasonable differentiation while still being simple to implement.
function getKey(identifier, ip) {
	return `${identifier || ''}|${ip || ''}`;
}

// Record a failed login attempt for the given identifier+IP.
// - Resets the count if the previous attempt is outside WINDOW_MS
// - When MAX_ATTEMPTS is reached, sets a temporary lockUntil timestamp
export const recordFailedAttempt = (identifier, ip) => {
	const key = getKey(identifier, ip);
	const now = Date.now();
	if (!attempts[key]) {
		attempts[key] = { count: 1, lastAttempt: now, lockUntil: null };
	} else {
		if (attempts[key].lockUntil && now < attempts[key].lockUntil) {
			// Still locked — do not increment further
			return;
		}
		if (now - attempts[key].lastAttempt > WINDOW_MS) {
			// Window expired: start a new count
			attempts[key].count = 1;
		} else {
			attempts[key].count += 1;
		}
		attempts[key].lastAttempt = now;
		if (attempts[key].count >= MAX_ATTEMPTS) {
			// Temporarily lock this key
			attempts[key].lockUntil = now + LOCK_TIME_MS;
		}
	}
};

// Return true when the identifier+IP is currently locked due to too many
// recent failed attempts.
export const isLocked = (identifier, ip) => {
	const key = getKey(identifier, ip);
	const now = Date.now();
	if (attempts[key] && attempts[key].lockUntil && now < attempts[key].lockUntil) {
		return true;
	}
	return false;
};

// Reset attempts for a key (e.g., after successful login)
export const resetAttempts = (identifier, ip) => {
	const key = getKey(identifier, ip);
	delete attempts[key];
};

// Cleanup stale entries to keep the in-memory store small. Call periodically
// (e.g., a scheduled job) in long-running processes.
export const cleanup = () => {
	const now = Date.now();
	for (const key in attempts) {
		if (
			(attempts[key].lockUntil && now > attempts[key].lockUntil) ||
			(now - attempts[key].lastAttempt > WINDOW_MS)
		) {
			delete attempts[key];
		}
	}
};