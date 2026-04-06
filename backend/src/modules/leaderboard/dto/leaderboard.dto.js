/**
 * ============================================================================
 * LEADERBOARD DTO (Data Transfer Object / The Query Validator)
 * ============================================================================
 * Purpose: This file ensures that when a user filters or requests the 
 * leaderboard, the parameters they send (like limit or category) are safe, 
 * valid, and won't crash the database. 
 * * Key Responsibilities:
 * 1. Validate 'limit' (Ensure a user doesn't try to fetch 1,000,000 rows at once).
 * 2. Validate 'category' (Ensure the user only sorts by fields that actually exist).
 * 3. Sanitize 'page' (For pagination logic).
 * * CRITICAL RULE: This is the "Bouncer" for the Leaderboard. If a user tries 
 * to send `?limit=unlimited` or `?category=passwords`, this file stops the 
 * request before it ever touches your database logic.
 */

import { sanitizeString } from "../../shared/utils/validators.js";

// Keep these allowlists as the single source of truth for query validation.
const ALLOWED_SORT_FIELDS = ["rank", "rating", "wins", "losses", "winRate"];
const ALLOWED_SORT_ORDERS = ["asc", "desc"];
const ALLOWED_TIERS = [
	"Bronze",
	"Silver",
	"Gold",
	"Platinum",
	"Diamond",
	"Expert",
	"Master",
	"Grandmaster",
];

const toBoolean = (value, fallback = false) => {
	if (value === undefined || value === null || value === "") {
		return fallback;
	}

	if (typeof value === "boolean") {
		return value;
	}

	const normalized = String(value).trim().toLowerCase();
	return ["1", "true", "yes", "y", "on"].includes(normalized);
};

const toInteger = (value, fallback) => {
	const parsed = Number.parseInt(value, 10);
	return Number.isInteger(parsed) ? parsed : fallback;
};

// Input contract for leaderboard filters and pagination from req.query.
export const createLeaderboardQueryDTO = (query = {}) => {
	return {
		season: sanitizeString(query.season || "global")?.toLowerCase(),
		page: toInteger(query.page, 1),
		limit: toInteger(query.limit, 10),
		sortBy: sanitizeString(query.sortBy || "rank"),
		sortOrder: sanitizeString(query.sortOrder || "asc")?.toLowerCase(),
		premiumOnly: toBoolean(query.premiumOnly, true),
		tier: sanitizeString(query.tier || ""),
		search: sanitizeString(query.search || ""),
	};
};

// Validation contract used by routes/services before repository calls.
export const validateLeaderboardQuery = (query = {}) => {
	const value = createLeaderboardQueryDTO(query);
	const errors = [];

	if (value.page < 1) {
		errors.push("page must be greater than or equal to 1");
	}

	if (value.limit < 1 || value.limit > 100) {
		errors.push("limit must be between 1 and 100");
	}

	if (!ALLOWED_SORT_FIELDS.includes(value.sortBy)) {
		errors.push(`sortBy must be one of: ${ALLOWED_SORT_FIELDS.join(", ")}`);
	}

	if (!ALLOWED_SORT_ORDERS.includes(value.sortOrder)) {
		errors.push(`sortOrder must be one of: ${ALLOWED_SORT_ORDERS.join(", ")}`);
	}

	if (value.tier && !ALLOWED_TIERS.includes(value.tier)) {
		errors.push(`tier must be one of: ${ALLOWED_TIERS.join(", ")}`);
	}

	return {
		valid: errors.length === 0,
		errors,
		value: {
			...value,
			skip: (value.page - 1) * value.limit,
		},
	};
};

// Row mapper used by UI table: keeps backend fields decoupled from UI naming.
export const createLeaderboardRowDTO = (rankDocument = {}, options = {}) => {
	const wins = Number(rankDocument.wins || 0);
	const losses = Number(rankDocument.losses || 0);
	const total = wins + losses;
	const computedRate = total === 0 ? 0 : Number(((wins / total) * 100).toFixed(1));

	const playerName =
		options.playerName ||
		rankDocument.playerName ||
		rankDocument.userName ||
		rankDocument.user?.username ||
		"Unknown Player";

	return {
		rank: Number(rankDocument.rank || 0),
		playerName,
		rating: Number(rankDocument.rating || 0),
		wins,
		losses,
		winRate: Number(rankDocument.winRate ?? computedRate),
		tier: rankDocument.tier || "Bronze",
		isPremium: Boolean(rankDocument.isPremium),
		rankChangeWeek: Number(rankDocument.rankChangeWeek || 0),
		isCurrentUser: Boolean(options.currentUserId) &&
			String(rankDocument.userId?._id || rankDocument.userId || "") === String(options.currentUserId),
	};
};

// Summary mapper used by the top cards (rank/rating/win rate block).
export const createLeaderboardSummaryDTO = ({
	row,
	previousWeekRank = null,
} = {}) => {
	if (!row) {
		return null;
	}

	const weeklyDelta =
		previousWeekRank === null ? Number(row.rankChangeWeek || 0) : previousWeekRank - row.rank;

	return {
		rank: row.rank,
		rating: row.rating,
		winRate: row.winRate,
		tier: row.tier,
		wins: row.wins,
		losses: row.losses,
		rankChangeWeek: weeklyDelta,
	};
};

// Final response shape for leaderboard APIs. Keep this stable for frontend.
export const createLeaderboardResponseDTO = ({
	rows = [],
	page = 1,
	limit = 10,
	total = 0,
	mySummary = null,
} = {}) => {
	const totalPages = Math.max(1, Math.ceil(total / limit));

	return {
		summary: mySummary,
		table: rows,
		pagination: {
			page,
			limit,
			total,
			totalPages,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};