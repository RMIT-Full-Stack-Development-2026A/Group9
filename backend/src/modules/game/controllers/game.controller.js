import { applyMove, toAlgebraicNotation, createSession as createGameSession, getSessionById, appendMove, abortSession as abortGameSession, getMovesBySessionId } from "../services/game.service.js";
import { getEasyAIMove } from "../ai/easyAI.js";
import { getMediumAIMove } from "../ai/mediumAI.js";
import { getHardAIMove } from "../ai/hardAI.js";

// ── Inline validators ─────────────────────────────────────────────────

function validBoardSize(v) {
	if (![10, 15].includes(v)) throw new Error("Invalid board size");
	return v;
}
function validGameType(v) {
	if (!["classic", "ai", "multiplayer"].includes(v)) throw new Error("Invalid game type");
	return v;
}

function validateSession(body, user) {
	const boardSize = validBoardSize(body.boardSize || 10);
	const gameType = validGameType(body.gameType || "classic");
	const player1 = user?.id;
	if (!player1) throw new Error("player1 required");
	if ((gameType === "classic" || gameType === "ai") && !body.player2Name?.trim()) {
		throw new Error("player2Name required");
	}
	return {
		player1,
		player2: body.player2 || null,
		player2Name: String(body.player2Name || "").trim(),
		boardSize,
		gameType,
	};
}

function validateMove(body) {
	const { sessionId, idx, marker } = body;
	if (!sessionId) throw new Error("sessionId required");
	if (typeof idx !== "number" || idx < 0) throw new Error("Invalid move index");
	if (!marker) throw new Error("marker required");
	return { sessionId, idx, marker };
}

function validateAIMove(body) {
	const { sessionId, lastPlayerMoveIdx, marker, aiLevel } = body;
	if (!sessionId) throw new Error("sessionId required");
	if (lastPlayerMoveIdx != null && (typeof lastPlayerMoveIdx !== "number" || lastPlayerMoveIdx < 0))
		throw new Error("Invalid lastPlayerMoveIdx");
	if (!marker) throw new Error("marker required");
	if (aiLevel && !["Easy", "Medium", "Hard"].includes(aiLevel))
		throw new Error("Invalid aiLevel");
	return { sessionId, lastPlayerMoveIdx, marker, aiLevel: aiLevel || "Easy" };
}

// ── Controllers ───────────────────────────────────────────────────────

export async function createSession(req, res) {
	try {
		const dto = validateSession(req.body, req.user);
		const session = await createGameSession(dto);
		res.status(201).json({ success: true, session });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

export async function makeMove(req, res) {
	try {
		const dto = validateMove(req.body);
		const session = await getSessionById(dto.sessionId);
		if (!session) throw new Error("Session not found");
		const { board, boardSize } = session;
		const moveResult = applyMove({ board, size: boardSize, idx: dto.idx, marker: dto.marker });

		const moveNumber = board.filter((c) => c != null).length + 1;
		const row = Math.floor(dto.idx / boardSize);
		const col = dto.idx % boardSize;
		const notation = toAlgebraicNotation(row, col, boardSize);
		const moveData = {
			playerId: dto.playerId || "player1",
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

export async function makeAIMove(req, res) {
	try {
		const dto = validateAIMove(req.body);
		const session = await getSessionById(dto.sessionId);
		if (!session) throw new Error("Session not found");
		if (session.result) throw new Error("Game already finished");
		if (session.gameType !== "ai") throw new Error("Not an AI session");

		const { board, boardSize } = session;
		const playerMarker = dto.lastPlayerMoveIdx != null ? board[dto.lastPlayerMoveIdx] : null;
		let aiIdx = null;
		if (dto.aiLevel === "Hard")
			aiIdx = getHardAIMove(board, boardSize, dto.lastPlayerMoveIdx, dto.marker, playerMarker);
		else if (dto.aiLevel === "Medium")
			aiIdx = getMediumAIMove(board, boardSize, dto.lastPlayerMoveIdx, dto.marker, playerMarker);
		else
			aiIdx = getEasyAIMove(board, boardSize, dto.lastPlayerMoveIdx);

		if (aiIdx == null) throw new Error("No valid AI move");

		const moveResult = applyMove({ board, size: boardSize, idx: aiIdx, marker: dto.marker });

		const moveNumber = board.filter((c) => c != null).length + 1;
		const row = Math.floor(aiIdx / boardSize);
		const col = aiIdx % boardSize;
		const notation = toAlgebraicNotation(row, col, boardSize);
		await appendMove(session._id, moveResult.board, moveResult, {
			playerId: "ai", marker: dto.marker, notation, row, col, moveNumber,
		}, moveResult.winner ? { result: "player2_win" } : {});

		res.status(200).json({ success: true, idx: aiIdx, ...moveResult });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

export async function abortSession(req, res) {
	try {
		const { sessionId } = req.body;
		if (!sessionId) throw new Error("sessionId required");

		const session = await getSessionById(sessionId);
		if (!session) throw new Error("Session not found");
		if (session.result && session.result !== "aborted") throw new Error("Game already finished");

		const userId = String(req.user?.id || "");
		const p1 = String(session.player1?._id || session.player1 || "");
		const p2 = String(session.player2?._id || session.player2 || "");
		if (userId && userId !== p1 && userId !== p2) throw new Error("Not allowed to abort this session");

		const updatedSession = await abortGameSession(session._id);
		res.status(200).json({ success: true, session: updatedSession });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}

export async function getSessionReplay(req, res) {
	try {
		const { sessionId } = req.params;
		const session = await getSessionById(sessionId);
		if (!session) throw new Error("Session not found");

		const userId = String(req.user?.id || "");
		const p1 = String(session.player1?._id || session.player1 || "");
		const p2 = String(session.player2?._id || session.player2 || "");
		if (userId && userId !== p1 && userId !== p2) throw new Error("Not allowed to access this replay");

		const moves = await getMovesBySessionId(session._id);
		res.status(200).json({
			success: true,
			session: {
				_id: session._id,
				boardSize: session.boardSize || 10,
				gameType: session.gameType,
				result: session.result,
				startTime: session.startTime,
				endTime: session.endTime,
			},
			moves: moves.map((m) => ({
				_id: m._id, moveNumber: m.moveNumber, playerId: m.playerId,
				marker: m.marker, row: m.row, col: m.col,
				notation: m.notation, playedAt: m.createdAt || null,
			})),
		});
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
}
