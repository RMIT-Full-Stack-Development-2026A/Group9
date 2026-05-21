
// Simple in-memory token blacklist used to revoke JWTs before their natural
// expiry. This is suitable for single-process deployments and small-scale
// applications — for production or multi-instance setups prefer a shared
// store (Redis) so revocations propagate across instances.
// Shape: { token: expiryTimestampMillis }
const blacklist = {};

// Add a token to the blacklist. `exp` is the token expiry timestamp (in seconds)
// typically taken from the JWT `exp` claim; we convert it to milliseconds.
export const add = (token, exp) => {
	// exp: expiry timestamp (seconds)
	if (token && exp) {
		blacklist[token] = exp * 1000; // convert to ms
	}
};

// Check whether a token is blacklisted and still within its blacklist window.
// Expired entries are cleaned up on read to avoid memory growth.
export const isBlacklisted = (token) => {
	if (!token) return false;
	const expiry = blacklist[token];
	if (!expiry) return false;
	if (Date.now() > expiry) {
		// Clean up expired blacklist entries
		delete blacklist[token];
		return false;
	}
	return true;
};

// Remove expired tokens from the blacklist. Run periodically in long-lived
// processes to prevent unbounded growth.
export const cleanup = () => {
	const now = Date.now();
	for (const token in blacklist) {
		if (blacklist[token] < now) {
			delete blacklist[token];
		}
	}
};