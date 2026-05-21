import * as gameService from '../services/game.service.js';
import { toGameHistoryItem } from '../dto/game.dto.js';

// Function map exposed as the module's public interface.
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

// Create a multiplayer session through the service layer.
export const createMultiplayerSession = ({ player1, player2, boardSize }) =>
	gameService.createMultiplayerSession({ player1, player2, boardSize });

// Fetch game history and map each item to the DTO shape.
export const getGameHistory = async (userId, query) => {
	const items = await gameService.getGameHistory(userId, query);
	return items.map(toGameHistoryItem);
};
