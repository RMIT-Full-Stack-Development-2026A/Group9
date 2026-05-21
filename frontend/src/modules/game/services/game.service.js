/**
 * ============================================================================
 * GAME SERVICE (The Logic Coordinator)
 * ============================================================================
 * Location: src/modules/game/services/game.service.js
 * Purpose: Shared pure helpers for the game module. This keeps UI components
 * and hooks focused on rendering and side effects while the service owns the
 * common data-shaping logic.
 * * Key Responsibilities:
 * 1. Session normalization: turn UI inputs into backend payloads.
 * 2. Display formatting: labels for game type, room, and player initials.
 * 3. Shared match helpers: reusable logic for offline/online presentation.
 */

/**
 * normalizeBackendGameType
 * - Normalize UI-facing `gameType` values into the canonical strings
 *   expected by the backend API. This centralizes mapping logic so the
 *   rest of the app can use friendly names (e.g. `local`, `single`) while
 *   the server receives consistent values (`classic`, `ai`, `multiplayer`).
 * - Rules:
 *   * `local` -> `classic`
 *   * `single` -> `ai`
 *   * `online` -> `multiplayer`
 */
export function normalizeBackendGameType(gameType) {
	const normalized = String(gameType || 'classic').toLowerCase();
	if (normalized === 'local') return 'classic';
	if (normalized === 'single') return 'ai';
	if (normalized === 'online') return 'multiplayer';
	return normalized;
}

/**
 * buildSessionPayload
 * - Convert a UI `sessionData` object into the minimal payload expected
 *   by the backend create-session endpoint. This keeps field-selection
 *   and normalization in a single place.
 * - Behavior:
 *   * Picks `player2` id if available, otherwise `null` for local/guest.
 *   * Falls back to a sensible `boardSize` default (10).
 *   * Normalizes `gameType` using `normalizeBackendGameType`.
 */
export function buildSessionPayload(sessionData = {}) {
	const player2Id = sessionData?.player2?.id || sessionData?.player2?._id || null;
	const boardSize = sessionData?.boardSize || 10;
	const gameType = normalizeBackendGameType(sessionData?.gameType);

	return {
		boardSize,
		gameType,
		player2: player2Id,
		player2Name:
			sessionData?.player2Name ||
			sessionData?.localPlayer2Name ||
			sessionData?.player2?.name ||
			'Guest',
	};
}

/**
 * getGameTypeLabel
 * - Convert an internal `gameType` string into a short, human-friendly
 *   label suitable for UI display (e.g., menu badges, headers).
 */
export function getGameTypeLabel(type) {
	const normalized = String(type || '').toLowerCase();
	if (normalized === 'ai') return 'AI';
	if (normalized === 'classic' || normalized === 'local') return 'Local';
	if (normalized === 'multiplayer' || normalized === 'online') return 'Multiplayer';
	return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Local';
}

/**
 * getRoomLabel
 * - Provide a readable room label based on `gameType` and `matchData`.
 * - For multiplayer sessions the function prefers `roomId`/`sessionId`/`_id`
 *   from the `matchData` so the UI can show an identifier for sharing.
 */
export function getRoomLabel(type, matchData = {}) {
	const normalized = String(type || '').toLowerCase();
	if (normalized === 'ai') return 'AI Room';
	if (normalized === 'classic' || normalized === 'local' || !normalized) return 'Local Room';
	if (normalized === 'multiplayer' || normalized === 'online') {
		return matchData?.roomId || matchData?.sessionId || matchData?._id || 'Online Room';
	}
	return 'Local Room';
}

/**
 * getPlayerInitial
 * - Return the uppercase initial for a player's display avatar. Falls back
 *   to the provided `fallback` (default `?`) when the name is missing.
 */
export function getPlayerInitial(name, fallback = '?') {
	if (!name || typeof name !== 'string') return fallback;
	return name.trim().charAt(0).toUpperCase() || fallback;
}

/**
 * isOfflineMatchType
 * - Predicate that returns true for match types that are considered
 *   offline/local (AI or classic/local). Useful for UI branches that
 *   should hide online-only features such as real-time chat or room links.
 */
export function isOfflineMatchType(gameType) {
	const normalized = String(gameType || '').toLowerCase();
	return normalized === 'ai' || normalized === 'classic' || normalized === 'local' || !normalized;
}

/**
 * buildMatchDisplayData
 * - Compose a small, UI-friendly object of derived display values from
 *   a `matchData` payload. This encapsulates decisions like badge text
 *   and room label so the rendering layers (e.g., ArenaView) stay simple.
 */
export function buildMatchDisplayData(matchData = {}) {
	const gameType = matchData?.gameType;
	const isOfflineMatch = isOfflineMatchType(gameType);
	return {
		isOfflineMatch,
		gameTypeLabel: getGameTypeLabel(gameType),
		roomLabel: getRoomLabel(gameType, matchData),
		player1BadgeLabel: getPlayerInitial(matchData?.player1Name, 'P1'),
		player2BadgeLabel: getPlayerInitial(matchData?.player2Name, 'P2'),
	};
}