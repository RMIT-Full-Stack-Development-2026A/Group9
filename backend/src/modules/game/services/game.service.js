import mongoose from "mongoose";
import { checkWinLine, isDraw } from "../engine/gameEngine.js";
import * as gameRepository from "../repositories/game.repository.js";

// ── Repository delegates ───────────────────────────────────────────────
// Create a session through the repository layer.
export const createSession = (dto) => gameRepository.createSession(dto);
// Fetch a session by id.
export const getSessionById = (sessionId) => gameRepository.getSessionById(sessionId);

// Create a multiplayer session after validating the required players and board size.
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
// Persist a move and any session updates.
export const appendMove = (sessionId, board, moveResult, moveData, updateExtra) =>
  gameRepository.appendMove(sessionId, board, moveResult, moveData, updateExtra);
// Abort a session by id.
export const abortSession = (sessionId) => gameRepository.abortSession(sessionId);
// Fetch all recorded moves for a session.
export const getMovesBySessionId = (sessionId) => gameRepository.getMovesBySessionId(sessionId);

// ── Game history query ─────────────────────────────────────────────────

// Build a user-centric history view from session documents.
// This function translates raw session records into a filtered, searchable,
// and UI-friendly history list for the requesting player.
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

	// Start with sessions where the user participated as either player1 or player2.
	const filter = {
		$or: [
			{ player1: userObjectId },
			{ player2: userObjectId },
		],
	};

	if (gameType) {
		// Normalize client-facing labels into stored database values.
		const normalizedGameType = {
			single: "ai",
			local: "classic",
			online: "multiplayer",
		}[gameType] || gameType;
		filter.gameType = normalizedGameType;
	}

	if (result === "win") {
		// For wins, match the result from the perspective of the current user.
		filter.$or = [
			{ player1: userObjectId, result: "player1_win" },
			{ player2: userObjectId, result: "player2_win" },
		];
	} else if (result === "lose") {
		// For losses, invert the winner marker relative to the current user.
		filter.$or = [
			{ player1: userObjectId, result: "player2_win" },
			{ player2: userObjectId, result: "player1_win" },
		];
	} else if (result === "draw" || result === "aborted") {
		// Draws and aborted games can be matched directly by stored result.
		filter.result = result;
	}

	if (startDate || endDate) {
		// Apply an inclusive startTime range, expanding endDate to the end of that day.
		filter.startTime = {};
		if (startDate) filter.startTime.$gte = new Date(startDate);
		if (endDate) {
			const end = new Date(endDate);
			end.setHours(23, 59, 59, 999);
			filter.startTime.$lte = end;
		}
	}

	const sort = { startTime: sortOrder === "asc" ? 1 : -1 };

	// Fetch candidate sessions from the repository using the assembled Mongo filter.
	let sessions = await gameRepository.findSessionsByUser(userObjectId, filter, sort);

	if (search) {
		// Perform in-memory search across session number, opponent names, and bot labels.
		const searchLower = search.toLowerCase();
		sessions = sessions.filter((session) => {
			let otherPlayers = [];
			if (session.player1 && String(session.player1?._id || session.player1) !== userId) {
				otherPlayers.push(session.player1);
			}
			if (session.player2 && String(session.player2?._id || session.player2) !== userId) {
				otherPlayers.push(session.player2);
			}

			if (session.sessionNumber != null && String(session.sessionNumber).includes(searchLower))
				return true;
			if (otherPlayers.some((p) => p.username?.toLowerCase().includes(searchLower)))
				return true;
			if (session.botName && session.botName.toLowerCase().includes(searchLower))
				return true;
			if (session.player2Name && session.player2Name.toLowerCase().includes(searchLower))
				return true;
			return false;
		});
	}

	// Transform each session into a user-centric shape for the history UI.
	// This resolves the match result from the player's perspective and
	// extracts the opponent/participants for display.
	return sessions.map((session) => {
		let userResult;
		if (session.result === "player1_win") {
			// If player1 won, the current user sees Win only when they are player1.
			userResult = String(session.player1?._id || session.player1 || "") === userId ? "Win" : "Lose";
		} else if (session.result === "player2_win") {
			// If player2 won, the current user sees Win only when they are player2.
			userResult = String(session.player2?._id || session.player2 || "") === userId ? "Win" : "Lose";
		} else if (session.result === "draw") {
			// Draws are shown uniformly regardless of seat assignment.
			userResult = "Draw";
		} else {
			// Any other terminal state is exposed as aborted.
			userResult = "Aborted";
		}

		let opponent = "Unknown";
		let players = [];
		if (session.gameType === "ai" || session.gameType === "single") {
			// AI sessions show the bot label instead of a second human player.
			opponent = session.player2Name || session.botName || "AI Bot";
			players = [
				{ role: "player1", name: session.player1?.username || "Unknown" },
				{ role: "opponent", name: session.player2Name || session.botName || "AI Bot" },
			];
		} else {
			// Multiplayer/classic sessions display the opposing human player's name.
			const userIdStr = String(session.player1?._id || session.player1 || "");
			if (userIdStr === userId) {
				opponent = session.player2?.username || session.player2Name || "Unknown";
			} else {
				opponent = session.player1?.username || "Unknown";
			}
			players = [
				{ role: "player1", name: session.player1?.username || "Unknown" },
				{ role: "player2", name: session.player2?.username || session.player2Name || "Unknown" },
			];
		}

		// Return the original session plus the derived UI fields.
		return { session, userResult, opponent, players };
	});
};

// Validates a move and returns the new board, winner, and draw state
// Apply a move to the in-memory board, then compute win/draw status.
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
// Convert zero-based row/col coordinates to chess-like notation.
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
