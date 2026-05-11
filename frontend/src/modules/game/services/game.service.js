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

export function normalizeBackendGameType(gameType) {
	const normalized = String(gameType || 'classic').toLowerCase();
	if (normalized === 'local') return 'classic';
	if (normalized === 'single') return 'ai';
	if (normalized === 'online') return 'multiplayer';
	return normalized;
}

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

export function getGameTypeLabel(type) {
	const normalized = String(type || '').toLowerCase();
	if (normalized === 'ai') return 'AI';
	if (normalized === 'classic' || normalized === 'local') return 'Local';
	if (normalized === 'multiplayer' || normalized === 'online') return 'Multiplayer';
	return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Local';
}

export function getRoomLabel(type, matchData = {}) {
	const normalized = String(type || '').toLowerCase();
	if (normalized === 'ai') return 'AI Room';
	if (normalized === 'classic' || normalized === 'local' || !normalized) return 'Local Room';
	if (normalized === 'multiplayer' || normalized === 'online') {
		return matchData?.roomId || matchData?.sessionId || matchData?._id || 'Online Room';
	}
	return 'Local Room';
}

export function getPlayerInitial(name, fallback = '?') {
	if (!name || typeof name !== 'string') return fallback;
	return name.trim().charAt(0).toUpperCase() || fallback;
}

export function isOfflineMatchType(gameType) {
	const normalized = String(gameType || '').toLowerCase();
	return normalized === 'ai' || normalized === 'classic' || normalized === 'local' || !normalized;
}

export function buildMatchDisplayData(matchData = {}) {
	const gameType = matchData?.gameType;
	const isOfflineMatch = isOfflineMatchType(gameType);
	return {
		isOfflineMatch,
		gameTypeLabel: getGameTypeLabel(gameType),
		roomLabel: getRoomLabel(gameType, matchData),
		player1BadgeLabel: isOfflineMatch ? 'P1' : getPlayerInitial(matchData?.player1Name, 'P1'),
		player2BadgeLabel: isOfflineMatch ? 'P2' : getPlayerInitial(matchData?.player2Name, 'P2'),
	};
}