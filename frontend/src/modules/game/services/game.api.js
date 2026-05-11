/**
 * ============================================================================
 * GAME API (The Matchmaking & Records Interface)
 * ============================================================================
 * Location: src/modules/game/services/game.api.js
 * Purpose: While useMultiplayer handles the "Live" WebSocket traffic, 
 * this service handles the standard HTTP requests for the Game module.
 * * Key Responsibilities:
 * 1. Matchmaking: Requesting to join a queue or creating a private room.
 * 2. Match History: Fetching a player's past "Toang" results.
 * 3. Leaderboards: Retrieving top-ranked players and their global XP.
 * 4. Game Validation: Fetching static game config or rules.
 */

import { api } from '../../../services/api.js';

// Create a new game session
export function createSession(sessionData) {
	return api.post('/api/game/sessions', sessionData);
}

// Make a move in a session
export function makeMove(moveData) {
	return api.post('/api/game/sessions/move', moveData);
}

// Request backend to compute + apply AI move (Easy)
export function makeAIMove(aiMoveData) {
	return api.post('/api/game/sessions/ai-move', aiMoveData);
}

// Abort an active game session
export function abortSession(abortData) {
	return api.post('/api/game/sessions/abort', abortData);
}