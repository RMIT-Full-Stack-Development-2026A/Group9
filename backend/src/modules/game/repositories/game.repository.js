/**
 * ============================================================================
 * GAME REPOSITORY (The Scorekeeper / Data Access Layer)
 * ============================================================================
 * Purpose: This file is the ONLY place in the Game module allowed to talk 
 * directly to the database (MongoDB/Mongoose). It handles the storage and 
 * retrieval of match states, player moves, and match history.
 * * Key Responsibilities:
 * 1. Create new game documents in the 'games' collection.
 * 2. Update the board array and turn status during active play.
 * 3. Fetch finished games for a user's match history.
 * 4. Perform aggregations for leaderboards (e.g., counting wins).
 * * CRITICAL RULE: A Repository must NEVER contain game logic (e.g., it 
 * shouldn't know how to check for a "win") and NEVER know about HTTP. It 
 * simply executes the database commands the Service asks for.
 */

// Implementation contract:
// 1) Persist sessions/moves atomically where needed (transactions when required).
// 2) Keep method names explicit: createSession, appendMove, setSessionResult, etc.
// 3) No board-rule logic here; this layer is read/write only.

import GameSession from "../models/gameSession.model.js";

/**
 * Find game sessions for a player with optional search, filter, and sort.
 *
 * @param {string} playerId - The player's ObjectId.
 * @param {object} options
 * @param {string}  [options.search]     - Pattern search on sessionNumber or player2 name.
 * @param {string}  [options.result]     - Filter by result enum value.
 * @param {string}  [options.gameType]   - Filter by gameType enum value.
 * @param {string}  [options.dateFrom]   - ISO date string, inclusive lower bound.
 * @param {string}  [options.dateTo]     - ISO date string, inclusive upper bound.
 * @param {string}  [options.sortOrder]  - "asc" or "desc" (default "desc").
 * @returns {Promise<Array>}
 */
export async function findByPlayer(playerId, options = {}) {
	const { search, result, gameType, dateFrom, dateTo, sortOrder = "desc" } = options;

	const filter = { players: playerId };

	// ── Result filter ──
	if (result) {
		filter.result = result;
	}

	// ── GameType filter ──
	if (gameType) {
		filter.gameType = gameType;
	}

	// ── Date range ──
	if (dateFrom || dateTo) {
		filter.startTime = {};
		if (dateFrom) filter.startTime.$gte = new Date(dateFrom);
		if (dateTo) filter.startTime.$lte = new Date(dateTo);
	}

	const sort = { startTime: sortOrder === "asc" ? 1 : -1 };

	let sessions = await GameSession.find(filter)
		.populate("players", "username")
		.populate("winner", "username")
		.sort(sort)
		.lean();

	// ── Pattern search (case-insensitive) ──
	if (search) {
		const pattern = new RegExp(search, "i");
		sessions = sessions.filter((s) => {
			// Match sessionNumber
			if (pattern.test(String(s.sessionNumber))) return true;

			// Match player2 name (any player that isn't the requesting player)
			const otherPlayers = (s.players || []).filter(
				(p) => String(p._id) !== String(playerId)
			);
			if (otherPlayers.some((p) => pattern.test(p.username))) return true;

			// Match botName
			if (s.botName && pattern.test(s.botName)) return true;

			// Match localPlayer2Name
			if (s.localPlayer2Name && pattern.test(s.localPlayer2Name)) return true;

			return false;
		});
	}

	return sessions;
}