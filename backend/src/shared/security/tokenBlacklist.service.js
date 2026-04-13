
// In-memory blacklist: { token: expiryTimestamp }
const blacklist = {};

export const add = (token, exp) => {
	// exp: expiry timestamp (seconds)
	if (token && exp) {
		blacklist[token] = exp * 1000; // convert to ms
	}
};

export const isBlacklisted = (token) => {
	if (!token) return false;
	const expiry = blacklist[token];
	if (!expiry) return false;
	if (Date.now() > expiry) {
		// Clean up expired
		delete blacklist[token];
		return false;
	}
	return true;
};

export const cleanup = () => {
	const now = Date.now();
	for (const token in blacklist) {
		if (blacklist[token] < now) {
			delete blacklist[token];
		}
	}
};