/**
 * ============================================================================
 * GAME FACADE FILE PURPOSE
 * ============================================================================
 * Purpose: Provides a thin orchestration layer for Game flows by coordinating
 * controller input, service logic, and repository persistence.
 * Current State: Exporting getPlayerHistory from repository for cross-module usage.
 * Owner: Game feature assignee.
 *
 * Teammate guidance:
 * 1) Keep facade focused on flow coordination, not HTTP/database details.
 * 2) Delegate rules to service/engine and persistence to repository.
 * 3) Expose stable functions used by controllers and realtime handlers.
 */

import * as gameRepo from "../repositories/game.repository.js";

/**
 * Fetch game history for a player
 */
export async function getPlayerHistory(userId, options = {}) {
	return await gameRepo.findByPlayer(userId, options);
}