import { GameInterface } from "../interface/game.interface.js";
import { validateAIMoveDTO, validateMoveDTO, validateSessionDTO } from '../dto/game.dto.js';
import { getEasyAIMove } from "../ai/easyAI.js";
import { getMediumAIMove } from "../ai/mediumAI.js";
import { getHardAIMove } from "../ai/hardAI.js";

// Create a new game session
export async function createSession(req, res) {
	try {
		console.log('--- createSession controller called ---');
		const dto = validateSessionDTO(req.body, req.user);
		const session = await GameInterface.createSession(dto);
		res.status(201).json({ success: true, session });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

// Handle a move in a session
export async function makeMove(req, res) {
	try {
		const dto = validateMoveDTO(req.body);
		const session = await GameInterface.getSessionById(dto.sessionId);
		if (!session) throw new Error('Session not found');
		const { board, boardSize } = session;
		const moveResult = GameInterface.applyMove({
			board,
			size: boardSize,
			idx: dto.idx,
			marker: dto.marker,
		});

		// Prepare move data for Move model
		const moveNumber = board.filter(cell => cell !== null && cell !== undefined).length + 1;
		const row = Math.floor(dto.idx / boardSize);
		const col = dto.idx % boardSize;
		const moveData = {
			playerId: dto.playerId || 'player1', // fallback if not provided
			marker: dto.marker,
			position: `${row},${col}`,
			row,
			col,
			moveNumber,
		};

		const updateExtra = {};
		if (moveResult.winner) {
			updateExtra.result = moveData.playerId === "player1" ? "player1_win" : "player2_win";
		}
		await GameInterface.appendMove(session._id, moveResult.board, moveResult, moveData, updateExtra);
		res.status(200).json({ success: true, ...moveResult });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

// Compute + apply an AI move on backend (Easy)
export async function makeAIMove(req, res) {
	try {
		const dto = validateAIMoveDTO(req.body);
		const session = await GameInterface.getSessionById(dto.sessionId);
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

		const moveResult = GameInterface.applyMove({
			board,
			size: boardSize,
			idx: aiIdx,
			marker: dto.marker,
		});

		const moveNumber = board.filter((cell) => cell !== null && cell !== undefined).length + 1;
		const row = Math.floor(aiIdx / boardSize);
		const col = aiIdx % boardSize;
		const moveData = {
			playerId: "ai",
			marker: dto.marker,
			position: `${row},${col}`,
			row,
			col,
			moveNumber,
		};

		const updateExtra = {};
		if (moveResult.winner) updateExtra.result = "player2_win";
		await GameInterface.appendMove(session._id, moveResult.board, moveResult, moveData, updateExtra);
		res.status(200).json({ success: true, idx: aiIdx, ...moveResult });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

