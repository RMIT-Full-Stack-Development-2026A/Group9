import * as multiplayerRepository from "../repositories/multiplayer.repository.js";
import AppError from "../../../shared/errors/AppError.js";
import * as gameInterface from "../../game/interface/game.interface.js";

export const createRoom = async (userId, { boardSize = 10, marker = "X", firstPlayer = "player1" }) => {
	const roomNumber = await multiplayerRepository.generateRoomNumber();
	const room = await multiplayerRepository.createRoom({
		roomNumber,
		player1: userId,
		boardSize,
		player1Marker: marker,
		firstPlayer,
		status: "waiting",
	});
	return multiplayerRepository.findRoomById(room._id);
};

export const getWaitingRooms = async () => {
	return multiplayerRepository.findWaitingRooms();
};

export const getActiveRooms = async () => {
	return multiplayerRepository.findActiveRooms();
};

export const joinRoom = async (roomId, userId, marker) => {
	const room = await multiplayerRepository.findRoomById(roomId);
	if (!room) throw new AppError("Room not found.", 404);
	if (room.status !== "waiting") throw new AppError("Room is not available.", 400);
	if (room.player1._id.toString() === userId) throw new AppError("Cannot join your own room.", 400);

	const selectedMarker = marker || (room.player1Marker === "X" ? "O" : "X");

	// Create a GameSession for the multiplayer match via the game interface
	const session = await gameInterface.createMultiplayerSession({
		player1: room.player1._id,
		player2: userId,
		boardSize: room.boardSize,
	});

	return multiplayerRepository.updateRoom(roomId, {
		player2: userId,
		player2Marker: selectedMarker,
		sessionId: session._id,
		status: "playing",
		startTime: new Date(),
	});
};

export const closeRoom = async (roomId) => {
	return multiplayerRepository.closeRoom(roomId);
};

export const getRoom = async (roomId) => {
	const room = await multiplayerRepository.findRoomById(roomId);
	if (!room) throw new AppError("Room not found.", 404);
	return room;
};

// ── Move processing (wraps game interface for the socket handler) ──────

export const processMove = async (sessionId, idx, marker, playerId) => {
	const session = await gameInterface.GameInterface.getSessionById(sessionId);
	if (!session) throw new AppError("Session not found", 404);

	const moveResult = gameInterface.GameInterface.applyMove({
		board: session.board,
		size: session.boardSize,
		idx,
		marker,
	});

	const moveNumber = session.board.filter(
		(cell) => cell !== null && cell !== undefined
	).length + 1;
	const row = Math.floor(idx / session.boardSize);
	const col = idx % session.boardSize;
	const notation = gameInterface.GameInterface.toAlgebraicNotation(
		row, col, session.boardSize
	);

	const moveData = {
		playerId: playerId,
		marker,
		notation: notation || "",
		row,
		col,
		moveNumber,
	};

	const updateExtra = {};
	if (moveResult.winner) {
		updateExtra.result =
			playerId === "player1" ? "player1_win" : "player2_win";
	}

	await gameInterface.GameInterface.appendMove(
		session._id, moveResult.board, moveResult, moveData, updateExtra
	);

	return {
		board: moveResult.board,
		turn: playerId === "player1" ? "player2" : "player1",
		winner: moveResult.winner,
		winLine: moveResult.winLine,
		draw: moveResult.draw,
		notation: notation || "",
	};
};
