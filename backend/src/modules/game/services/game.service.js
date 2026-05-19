import mongoose from "mongoose";
import { checkWinLine, isDraw } from "../engine/gameEngine.js";
import * as gameRepository from "../repositories/game.repository.js";
import GameSession from "../models/gameSession.model.js";

// ── Repository delegates ───────────────────────────────────────────────
export const createSession = (dto) => gameRepository.createSession(dto);
export const getSessionById = (sessionId) => gameRepository.getSessionById(sessionId);

export const createMultiplayerSession = async ({ player1, player2, boardSize }) => {
	if (!player1 || !player2) throw new Error("Both players are required");
	if (![10, 15].includes(boardSize)) throw new Error("Invalid board size");

	return gameRepository.createSession({
		player1,
		player2,
		boardSize,
		gameType: "multiplayer",
		player2Name: "",
	});
};
export const appendMove = (sessionId, board, moveResult, moveData, updateExtra) =>
  gameRepository.appendMove(sessionId, board, moveResult, moveData, updateExtra);
export const abortSession = (sessionId) => gameRepository.abortSession(sessionId);
export const getMovesBySessionId = (sessionId) => gameRepository.getMovesBySessionId(sessionId);

// ── Game history query ─────────────────────────────────────────────────

export const getGameHistory = async (userId, query = {}) => {
	const userObjectId = new mongoose.Types.ObjectId(userId);
	const {
		search,
		gameType,
		result,
		startDate,
		endDate,
		sortOrder = "desc",
	} = query;

	const filter = {
		$or: [
			{ player1: userObjectId },
			{ player2: userObjectId },
		],
	};

	if (gameType) {
		const normalizedGameType = {
			single: "ai",
			local: "classic",
			online: "multiplayer",
		}[gameType] || gameType;
		filter.gameType = normalizedGameType;
	}

	if (result === "win") {
		filter.$or = [
			{ player1: userObjectId, result: "player1_win" },
			{ player2: userObjectId, result: "player2_win" },
		];
	} else if (result === "lose") {
		filter.$or = [
			{ player1: userObjectId, result: "player2_win" },
			{ player2: userObjectId, result: "player1_win" },
		];
	} else if (result === "draw" || result === "aborted") {
		filter.result = result;
	}

	if (startDate || endDate) {
		filter.startTime = {};
		if (startDate) filter.startTime.$gte = new Date(startDate);
		if (endDate) {
			const end = new Date(endDate);
			end.setHours(23, 59, 59, 999);
			filter.startTime.$lte = end;
		}
	}

	const sort = { startTime: sortOrder === "asc" ? 1 : -1 };

	let sessions = await GameSession.find(filter)
		.populate("player1", "username")
		.populate("player2", "username")
		.populate("winner", "username")
		.sort(sort)
		.lean();

	if (search) {
		const searchLower = search.toLowerCase();
		sessions = sessions.filter((session) => {
			let otherPlayers = [];
			if (session.player1 && String(session.player1?._id || session.player1) !== userId) {
				otherPlayers.push(session.player1);
			}
			if (session.player2 && String(session.player2?._id || session.player2) !== userId) {
				otherPlayers.push(session.player2);
			}

			if (otherPlayers.some((p) => p.username?.toLowerCase().includes(searchLower)))
				return true;
			if (session.botName && session.botName.toLowerCase().includes(searchLower))
				return true;
			if (session.player2Name && session.player2Name.toLowerCase().includes(searchLower))
				return true;
			return false;
		});
	}

	return sessions;
};

// Validates a move and returns the new board, winner, and draw state
export function applyMove({ board, size, idx, marker }) {
  if (board[idx] !== null && board[idx] !== undefined) {
    throw new Error("Cell already occupied");
  }
  const newBoard = [...board];
  newBoard[idx] = marker;
  const winLine = checkWinLine(newBoard, size, marker);
  const draw = !winLine && isDraw(newBoard);
  return {
    board: newBoard,
    winLine,
    winner: winLine ? marker : null,
    draw,
  };
}

// Converts a board coordinate to algebraic notation (A1, C2, ...)
// Columns are left->right as letters, rows are bottom->top as 1..N.
export function toAlgebraicNotation(row, col, boardSize) {
  if (!Number.isInteger(row) || !Number.isInteger(col) || !Number.isInteger(boardSize)) {
    return null;
  }
  if (row < 0 || col < 0 || row >= boardSize || col >= boardSize) {
    return null;
  }

  const toLetters = (zeroBasedCol) => {
    let n = zeroBasedCol + 1;
    let out = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      out = String.fromCharCode(65 + rem) + out;
      n = Math.floor((n - 1) / 26);
    }
    return out;
  };

  const file = toLetters(col);
  const rank = boardSize - row;
  return `${file}${rank}`;
}
