import { api } from '../../../services/api.js';
import { API_ROUTES } from '../../../config/apiRoutes.js';

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
