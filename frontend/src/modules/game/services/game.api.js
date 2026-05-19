
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