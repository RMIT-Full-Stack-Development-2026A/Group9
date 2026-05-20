import * as gameService from '../services/game.service.js';
import { toGameHistoryItem } from '../dto/game.dto.js';

export const GameInterface = {
	createSession: gameService.createSession,
	getSessionById: gameService.getSessionById,
	applyMove: gameService.applyMove,
	toAlgebraicNotation: gameService.toAlgebraicNotation,
	appendMove: gameService.appendMove,
	abortSession: gameService.abortSession,
	getMovesBySessionId: gameService.getMovesBySessionId,
};

// ── Cross-module operations ────────────────────────────────────────────

export const createMultiplayerSession = ({ player1, player2, boardSize }) =>
	gameService.createMultiplayerSession({ player1, player2, boardSize });

export const getGameHistory = async (userId, query) => {
	const items = await gameService.getGameHistory(userId, query);
	return items.map(toGameHistoryItem);
};
