export function extractUserRecord(payload) {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	if (payload.user && typeof payload.user === "object") {
		return payload.user;
	}

	if (payload.data && typeof payload.data === "object") {
		if (payload.data.user && typeof payload.data.user === "object") {
			return payload.data.user;
		}

		// Some APIs store user fields directly under data.
		if (payload.data.username || payload.data.email || payload.data.role) {
			return payload.data;
		}
	}

	return payload;
}

export function getStoredUser() {
	const storageKeys = ["currentUser", "user", "authUser"];

	for (const key of storageKeys) {
		const rawValue = localStorage.getItem(key);
		if (!rawValue) {
			continue;
		}

		try {
			const parsedValue = JSON.parse(rawValue);
			if (parsedValue && typeof parsedValue === "object") {
				return extractUserRecord(parsedValue);
			}
		} catch {
			// Ignore malformed values and continue checking other keys.
		}
	}

	return null;
}

export function isPremiumUser(user) {
	if (typeof user.isPremium === "boolean") {
		return user.isPremium;
	}

	const role = String(user.role || "").toLowerCase();
	if (role === "premium") {
		return true;
	}

	if (!user.premiumUntil) {
		return false;
	}

	const premiumUntilDate = new Date(user.premiumUntil);
	return !Number.isNaN(premiumUntilDate.getTime()) && premiumUntilDate.getTime() > Date.now();
}

export function getWelcomeLine(user) {
	if (!user) {
		return {
			text: "WELCOME TO TICTACTOANG",
			type: "guest",
		};
	}

	const displayName = String(user.username || user.name || user.email || "PLAYER")
		.split("@")[0]
		.toUpperCase();

	if (isPremiumUser(user)) {
		return {
			text: `PREMIUM MEMBER - WELCOME, ${displayName}`,
			type: "premium",
		};
	}

	return {
		text: `WELCOME, ${displayName}`,
		type: "normal",
	};
}

