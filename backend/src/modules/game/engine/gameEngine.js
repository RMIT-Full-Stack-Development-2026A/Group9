import AppError from "../../shared/errors/AppError.js";
import {
	DEFAULT_BOARD_SIZE,
	GAME_STATUS,
	PLAYER_SYMBOLS,
} from "../types/game.types.js";

export const createEmptyBoard = (boardSize = DEFAULT_BOARD_SIZE) => {
	return Array.from({ length: boardSize * boardSize }, () => null);
};

const buildWinningLines = (boardSize) => {
	const lines = [];

	for (let row = 0; row < boardSize; row += 1) {
		lines.push(
			Array.from({ length: boardSize }, (_, column) => row * boardSize + column)
		);
	}

	for (let column = 0; column < boardSize; column += 1) {
		lines.push(
			Array.from({ length: boardSize }, (_, row) => row * boardSize + column)
		);
	}

	lines.push(
		Array.from({ length: boardSize }, (_, step) => step * (boardSize + 1))
	);

	lines.push(
		Array.from({ length: boardSize }, (_, step) => (step + 1) * (boardSize - 1))
	);

	return lines;
};

export const evaluateBoard = (board, boardSize = DEFAULT_BOARD_SIZE) => {
	const winningLines = buildWinningLines(boardSize);

	for (const line of winningLines) {
		const first = board[line[0]];
		if (!first) {
			continue;
		}

		const allMatch = line.every((index) => board[index] === first);
		if (allMatch) {
			return {
				status: GAME_STATUS.FINISHED,
				winner: first,
				winningLine: line,
			};
		}
	}

	if (board.every((cell) => cell !== null)) {
		return {
			status: GAME_STATUS.DRAW,
			winner: null,
			winningLine: [],
		};
	}

	return {
		status: GAME_STATUS.ACTIVE,
		winner: null,
		winningLine: [],
	};
};

export const getNextPlayer = (currentPlayer) => {
	return currentPlayer === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
};

export const makeMove = ({
	board,
	index,
	player,
	boardSize = DEFAULT_BOARD_SIZE,
}) => {
	if (!Array.isArray(board) || board.length !== boardSize * boardSize) {
		throw new AppError("Invalid board state", 400);
	}

	if (![PLAYER_SYMBOLS.X, PLAYER_SYMBOLS.O].includes(player)) {
		throw new AppError("Invalid player symbol", 400);
	}

	if (!Number.isInteger(index) || index < 0 || index >= board.length) {
		throw new AppError("Move index is outside board range", 400);
	}

	if (board[index] !== null) {
		throw new AppError("Selected cell is already occupied", 400);
	}

	const nextBoard = [...board];
	nextBoard[index] = player;

	const result = evaluateBoard(nextBoard, boardSize);

	return {
		board: nextBoard,
		...result,
	};
};