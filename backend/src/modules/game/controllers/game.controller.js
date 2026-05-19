import { applyMove, toAlgebraicNotation, createSession as createGameSession, getSessionById, appendMove, abortSession as abortGameSession, getMovesBySessionId } from "../services/game.service.js";
import { validateAbortSessionDTO, validateAIMoveDTO, validateMoveDTO, validateSessionDTO } from '../dto/game.dto.js';
import { getEasyAIMove } from "../ai/easyAI.js";
import { getMediumAIMove } from "../ai/mediumAI.js";
import { getHardAIMove } from "../ai/hardAI.js";

// Create a new game session
export async function createSession(req, res) {
	try {
		console.log('--- createSession controller called ---');
		const dto = validateSessionDTO(req.body, req.user);
		const session = await createGameSession(dto);
		res.status(201).json({ success: true, session });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

// Handle a move in a session
export async function makeMove(req, res) {
	try {
		const dto = validateMoveDTO(req.body);
		const session = await getSessionById(dto.sessionId);
		if (!session) throw new Error('Session not found');
		const { board, boardSize } = session;
		const moveResult = applyMove({
			board,
			size: boardSize,
			idx: dto.idx,
			marker: dto.marker,
		});

		// Prepare move data for Move model
		const moveNumber = board.filter(cell => cell !== null && cell !== undefined).length + 1;
		const row = Math.floor(dto.idx / boardSize);
		const col = dto.idx % boardSize;
		const notation = toAlgebraicNotation(row, col, boardSize);
		const moveData = {
			playerId: dto.playerId || 'player1', // fallback if not provided
			marker: dto.marker,
			notation,
			row,
			col,
			moveNumber,
		};

		const updateExtra = {};
		if (moveResult.winner) {
			updateExtra.result = moveData.playerId === "player1" ? "player1_win" : "player2_win";
		}
		await appendMove(session._id, moveResult.board, moveResult, moveData, updateExtra);
		res.status(200).json({ success: true, ...moveResult });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

// Compute + apply an AI move on backend (Easy)
export async function makeAIMove(req, res) {
	try {
		const dto = validateAIMoveDTO(req.body);
		const session = await getSessionById(dto.sessionId);
		if (!session) throw new Error("Session not found");
		if (session.result) throw new Error("Game already finished");
		if (session.gameType !== "ai") throw new Error("Not an AI session");

		const { board, boardSize } = session;
		const playerMarker = dto.lastPlayerMoveIdx != null ? board[dto.lastPlayerMoveIdx] : null;
		let aiIdx = null;
		if (dto.aiLevel === "Hard") {
			aiIdx = getHardAIMove(board, boardSize, dto.lastPlayerMoveIdx, dto.marker, playerMarker);
		} else if (dto.aiLevel === "Medium") {
			aiIdx = getMediumAIMove(board, boardSize, dto.lastPlayerMoveIdx, dto.marker, playerMarker);
		} else {
			aiIdx = getEasyAIMove(board, boardSize, dto.lastPlayerMoveIdx);
		}
		if (aiIdx == null) throw new Error("No valid AI move");

		const moveResult = applyMove({
			board,
			size: boardSize,
			idx: aiIdx,
			marker: dto.marker,
		});

		const moveNumber = board.filter((cell) => cell !== null && cell !== undefined).length + 1;
		const row = Math.floor(aiIdx / boardSize);
		const col = aiIdx % boardSize;
		const notation = toAlgebraicNotation(row, col, boardSize);
		const moveData = {
			playerId: "ai",
			marker: dto.marker,
			notation,
			row,
			col,
			moveNumber,
		};

		const updateExtra = {};
		if (moveResult.winner) updateExtra.result = "player2_win";
		await appendMove(session._id, moveResult.board, moveResult, moveData, updateExtra);
		res.status(200).json({ success: true, idx: aiIdx, ...moveResult });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

// Abort a game session without recording a winner or loser
export async function abortSession(req, res) {
	try {
		const dto = validateAbortSessionDTO(req.body);
		const session = await getSessionById(dto.sessionId);
		if (!session) throw new Error('Session not found');
		if (session.result && session.result !== 'aborted') throw new Error('Game already finished');

		const userId = String(req.user?.id || '');
		const player1Id = String(session.player1?._id || session.player1 || '');
		const player2Id = String(session.player2?._id || session.player2 || '');
		if (userId && userId !== player1Id && userId !== player2Id) {
			throw new Error('Not allowed to abort this session');
		}

		const updatedSession = await abortGameSession(session._id);
		res.status(200).json({ success: true, session: updatedSession });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

// Get replay data (premium only) for a finished or in-progress session
export async function getSessionReplay(req, res) {
	try {
		const { sessionId } = req.params;
		const session = await getSessionById(sessionId);
		if (!session) throw new Error('Session not found');

		const userId = String(req.user?.id || '');
		const player1Id = String(session.player1?._id || session.player1 || '');
		const player2Id = String(session.player2?._id || session.player2 || '');
		if (userId && userId !== player1Id && userId !== player2Id) {
			throw new Error('Not allowed to access this replay');
		}

		const boardSize = session.boardSize || 10;
		const moves = await getMovesBySessionId(session._id);
		const replayMoves = moves.map((move) => ({
			_id: move._id,
			moveNumber: move.moveNumber,
			playerId: move.playerId,
			marker: move.marker,
			row: move.row,
			col: move.col,
			notation: move.notation,
			playedAt: move.createdAt || null,
		}));

		res.status(200).json({
			success: true,
			session: {
				_id: session._id,
				boardSize,
				gameType: session.gameType,
				result: session.result,
				startTime: session.startTime,
				endTime: session.endTime,
			},
			moves: replayMoves,
		});
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

