import GameSession from '../models/gameSession.model.js';
import Move from '../models/move.model.js';

export async function createSession(dto) {
	const last = await GameSession.findOne({}).sort({ sessionNumber: -1 }).lean();
	const sessionNumber = (last?.sessionNumber || 0) + 1;
	const session = new GameSession({
		...dto,
		sessionNumber,
		board: Array(dto.boardSize * dto.boardSize).fill(null),
	});
	return await session.save();
}

export async function getSessionById(sessionId) {
	return await GameSession.findById(sessionId);
}

export async function appendMove(sessionId, board, moveResult, moveData, updateExtra = {}) {
	// Persist move in Moves collection
	await Move.create({
		sessionId,
		playerId: moveData.playerId,
		marker: moveData.marker,
		notation: moveData.notation,
		row: moveData.row,
		col: moveData.col,
		moveNumber: moveData.moveNumber,
	});

	// Update session state
	const update = {
		board,
		...updateExtra,
	};
	if (moveResult.winner) {
		update.winnerMarker = moveResult.winner;
		update.endTime = new Date();
	} else if (moveResult.draw) {
		update.result = 'draw';
		update.endTime = new Date();
	}
	return await GameSession.findByIdAndUpdate(sessionId, update, { returnDocument: "after" });
}

export async function abortSession(sessionId) {
	return await GameSession.findByIdAndUpdate(
		sessionId,
		{
			result: 'aborted',
			winner: null,
			winnerMarker: null,
			endTime: new Date(),
		},
		{ returnDocument: "after" }
	);
}

export async function findSessionsByUser(userObjectId, filter, sort) {
	return GameSession.find(filter)
		.populate("player1", "username")
		.populate("player2", "username")
		.populate("winner", "username")
		.sort(sort)
		.lean();
}

export async function getMovesBySessionId(sessionId) {
	return await Move.find({ sessionId })
		.sort({ moveNumber: 1, createdAt: 1 })
		.lean();
}
