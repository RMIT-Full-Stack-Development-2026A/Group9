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
