/**
 * ============================================================================
 * HOME SERVICE (The Dashboard Logic)
 * ============================================================================
 * Location: src/modules/home/services/home.service.js
 * Purpose: This service handles data transformation and business logic specific 
 * to the Home/Lobby module. It bridges the gap between raw API data and 
 * the high-level stats shown to the player.
 * * Key Responsibilities:
 * 1. Progress Calculation: Determining how much XP is needed for the next Rank.
 * 2. Stat Normalization: Calculating win/loss ratios for the UI.
 * 3. News Filtering: Sorting or formatting announcements.
 * 4. Rank Mapping: Translating numeric Elo/XP into "Toang" Rank tiers.
 */

import { AUTH_USER_KEY } from "../../../config/api.config.js";

//Merge 2 data models together because frontend needs one clean, consistent object
const mergeAccountAndProfile = (account, profile) => {
	//Handle if account = null
	if (!account || typeof account !== "object") {
		return null;
	}

	// Normalize user data: merge account (base) + profile (override),
	// apply fallbacks, and enforce consistent types for UI
	return {
		...account,
		premiumUntil: profile?.premiumUntil ?? account.premiumUntil ?? null,
		avatar: profile?.avatar ?? account.avatar ?? "",
		country: profile?.country ?? account.country ?? "",
		walletBalance: Number(profile?.walletBalance ?? account.walletBalance ?? 0),
	};
};


//Check if this is user
const looksLikeUser = (value) => {
	//Handle if value = null
	if (!value || typeof value !== "object") {
		return false;
	}

	//Return user if satisfie one of these value
	return Boolean(value.username || value.email || value.role || value.id || value._id);
};

export function extractUserRecord(payload) {
	//Handle if object = null
	if (!payload || typeof payload !== "object") {
		return null;
	}

	// If the payload has an 'account' object, merge it with 'profile' 
	// to create a normalized user object for the UI.
	if (payload.account && typeof payload.account === "object") {
		return mergeAccountAndProfile(payload.account, payload.profile);
	}

	// If the payload has a 'user' object, check if it contains an 'account' (for normalized data),
	// otherwise return the user object directly.
	if (payload.user && typeof payload.user === "object") {
		if (payload.user.account && typeof payload.user.account === "object") {
			return mergeAccountAndProfile(payload.user.account, payload.user.profile);
		}

		return payload.user;
	}

	// If the payload has a 'data' object, check for nested 'account' or 'user' objects,
	// and merge or return as appropriate. Some APIs may store user fields directly under 'data'.
	if (payload.data && typeof payload.data === "object") {
		if (payload.data.account && typeof payload.data.account === "object") {
			return mergeAccountAndProfile(payload.data.account, payload.data.profile);
		}

		if (payload.data.user && typeof payload.data.user === "object") {
			if (payload.data.user.account && typeof payload.data.user.account === "object") {
				return mergeAccountAndProfile(payload.data.user.account, payload.data.user.profile);
			}

			return payload.data.user;
		}

		// Some APIs store user fields directly under data.
		if (looksLikeUser(payload.data)) {
			return payload.data;
		}
	}

	// As a fallback, if the payload itself looks like a user, return it; otherwise, return null.
	return looksLikeUser(payload) ? payload : null;
}

// Attempts to retrieve and parse the stored user object from localStorage using several possible keys.
// Returns the first valid user object found, or null if none are valid.
export function getStoredUser() {
    const storageKeys = [AUTH_USER_KEY];

    for (const key of storageKeys) {
        const rawValue = localStorage.getItem(key);
        if (!rawValue) {
            continue;
        }

        try {
            // Parse the JSON string into an object. If successful and the result is an object,
            // extract and normalize the user record for use in the UI.
            const parsedValue = JSON.parse(rawValue);
            if (parsedValue && typeof parsedValue === "object") {
                return extractUserRecord(parsedValue);
            }
        } catch {
            // Ignore malformed values and continue checking other keys.
        }
    }

    // If no valid user object is found, return null.
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