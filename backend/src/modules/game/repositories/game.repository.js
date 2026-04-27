import GameSession from '../models/gameSession.model.js';
import Move from '../models/move.model.js';

export async function createSession(dto) {
	const session = new GameSession({
		...dto,
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
		position: moveData.position,
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
	return await GameSession.findByIdAndUpdate(sessionId, update, { new: true });
}
