/**
 * ============================================================================
 * LEADERBOARD SERVICE (The Competitive Analytics)
 * ============================================================================
 * Location: src/modules/leaderboard/services/leaderboard.service.js
 * Purpose: This service handles the logic for categorizing and analyzing 
 * the global rankings. It translates raw player data into the "Toang" 
 * competitive hierarchy.
 * * Key Responsibilities:
 * 1. Tier Assignment: Categorizing players into leagues (Master, Diamond, etc.).
 * 2. Trend Analysis: (Future) Identifying if a player is climbing or falling.
 * 3. Stats Aggregation: Calculating average XP or Win Rates across the top players.
 * 4. Data Cleaning: Handling edge cases like players with 0 games or hidden profiles.
 */

import { http } from "../../../shared/utils/http.helper.js";

export const getGlobalLeaderboard = async (query = "") => {
	return http(`/leaderboard/global${query ? `?${query}` : ""}`, { method: "GET" });
};

export const getMyLeaderboardSummary = async () => {
	return http("/leaderboard/me", { method: "GET" });
};