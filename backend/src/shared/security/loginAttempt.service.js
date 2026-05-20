
// In-memory store: { key: { count, lastAttempt, lockUntil } }
const attempts = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 60 seconds
const LOCK_TIME_MS = 60 * 1000; // 60 seconds

function getKey(identifier, ip) {
	return `${identifier || ''}|${ip || ''}`;
}

export const recordFailedAttempt = (identifier, ip) => {
	const key = getKey(identifier, ip);
	const now = Date.now();
	if (!attempts[key]) {
		attempts[key] = { count: 1, lastAttempt: now, lockUntil: null };
	} else {
		if (attempts[key].lockUntil && now < attempts[key].lockUntil) {
			// Still locked
			return;
		}
		if (now - attempts[key].lastAttempt > WINDOW_MS) {
			attempts[key].count = 1;
		} else {
			attempts[key].count += 1;
		}
		attempts[key].lastAttempt = now;
		if (attempts[key].count >= MAX_ATTEMPTS) {
			attempts[key].lockUntil = now + LOCK_TIME_MS;
		}
	}
};

export const isLocked = (identifier, ip) => {
	const key = getKey(identifier, ip);
	const now = Date.now();
	if (attempts[key] && attempts[key].lockUntil && now < attempts[key].lockUntil) {
		return true;
	}
	return false;
};

export const resetAttempts = (identifier, ip) => {
	const key = getKey(identifier, ip);
	delete attempts[key];
};

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