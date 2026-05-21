import { api } from '../../../services/api.js';
import { API_ROUTES } from '../../../config/apiRoutes.js';

/*
	game.api.js
	- Thin HTTP adapter that centralizes all network calls for the Game
		module. Returning the raw `api` promise lets callers inspect
		`response.data` or handle different HTTP error shapes centrally.
	- Keep this file minimal; any response transformations belong in
		higher-level hooks (e.g., `useGame`).
*/
export function createSession(sessionData) {
	return api.post(API_ROUTES.game.sessions, sessionData);
}

export function makeMove(moveData) {
	return api.post(API_ROUTES.game.move, moveData);
}

export function makeAIMove(aiMoveData) {
	return api.post(API_ROUTES.game.aiMove, aiMoveData);
}

export function abortSession(abortData) {
	return api.post(API_ROUTES.game.abort, abortData);
}
