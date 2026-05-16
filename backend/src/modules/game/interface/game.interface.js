// Game interface for service usage
import * as gameService from '../services/game.service.js';
import * as gameRepository from '../repositories/game.repository.js';

export const GameInterface = {
	createSession: gameRepository.createSession,
	getSessionById: gameRepository.getSessionById,
	applyMove: gameService.applyMove,
	toAlgebraicNotation: gameService.toAlgebraicNotation,
	appendMove: gameRepository.appendMove,
	abortSession: gameRepository.abortSession,
	getMovesBySessionId: gameRepository.getMovesBySessionId,
};
