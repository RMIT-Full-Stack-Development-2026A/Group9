import AppError from "../../shared/errors/AppError.js";
import {
	createGameDTO,
	validateCreateGamePayload,
	validateMovePayload,
} from "../dto/game.dto.js";
import {
	createEmptyBoard,
	getNextPlayer,
	makeMove as applyEngineMove,
} from "../engine/gameEngine.js";
import { DEFAULT_BOARD_SIZE, GAME_STATUS, PLAYER_SYMBOLS } from "../types/game.types.js";

export const createGame = (payload = {}) => {
	// DTO validation here guarantees service logic receives normalized values.
	const { valid, errors } = validateCreateGamePayload(payload);
	if (!valid) {
		throw new AppError("Invalid create game payload", 400, errors);
	}

	const dto = createGameDTO(payload);

	return {
		id: null,
		boardSize: dto.boardSize || DEFAULT_BOARD_SIZE,
		gameType: dto.gameType,
		aiLevel: dto.aiLevel,
		board: createEmptyBoard(dto.boardSize || DEFAULT_BOARD_SIZE),
		status: GAME_STATUS.ACTIVE,
		nextPlayer: PLAYER_SYMBOLS.X,
		winner: null,
		winningLine: [],
	};
};

export const makeMove = (session, payload = {}) => {
	// Service owns turn/state rules; engine handles board math only.
	if (!session) {
		throw new AppError("Game session is required", 400);
	}

	if (session.status !== GAME_STATUS.ACTIVE) {
		throw new AppError("Game is not active", 400);
	}

	const { valid, errors, value } = validateMovePayload(payload, session.boardSize || DEFAULT_BOARD_SIZE);
	if (!valid) {
		throw new AppError("Invalid move payload", 400, errors);
	}

	if (value.player !== session.nextPlayer) {
		throw new AppError("It is not this player's turn", 409);
	}

	const moveResult = applyEngineMove({
		board: session.board,
		index: value.index,
		player: value.player,
		boardSize: session.boardSize || DEFAULT_BOARD_SIZE,
	});

	const nextPlayer =
		moveResult.status === GAME_STATUS.ACTIVE ? getNextPlayer(value.player) : null;

	return {
		...session,
		board: moveResult.board,
		status: moveResult.status,
		winner: moveResult.winner,
		winningLine: moveResult.winningLine,
		nextPlayer,
		lastMoveIndex: value.index,
	};
};