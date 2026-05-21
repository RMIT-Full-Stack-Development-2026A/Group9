import * as multiplayerRepository from "../repositories/multiplayer.repository.js";
import AppError from "../../../shared/errors/AppError.js";
import * as gameInterface from "../../game/interface/game.interface.js";
import * as userInterface from "../../user/interface/user.interface.js";

const ALL_MARKERS = ["X", "O", "⭐", "🔥", "💎", "🌙"];

// Enrich a room object with player avatars when the populated document does not already include them.
const enrichRoomAvatars = async (room) => {
	if (!room) return room;
	const obj = room.toObject ? room.toObject() : room;

	if (obj.player1 && !obj.player1.avatar) {
		const profile = await userInterface.findUserById(obj.player1._id);
		if (profile?.avatar) obj.player1.avatar = profile.avatar;
	}

	if (obj.player2 && !obj.player2.avatar) {
		const profile = await userInterface.findUserById(obj.player2._id);
		if (profile?.avatar) obj.player2.avatar = profile.avatar;
	}

	return obj;
};

// Create a waiting multiplayer room for the current user and return the room with avatar data attached.
export const createRoom = async (userId, { boardSize = 10, boardStyle = "Classic", marker = "X", firstPlayer = "player1" }) => {
	const roomNumber = await multiplayerRepository.generateRoomNumber();
	const room = await multiplayerRepository.createRoom({
		roomNumber,
		player1: userId,
		boardSize,
		boardStyle,
		player1Marker: marker,
		firstPlayer,
		status: "waiting",
	});
	return enrichRoomAvatars(await multiplayerRepository.findRoomById(room._id));
};

// Return all rooms that are currently waiting for a second player.
export const getWaitingRooms = async () => {
	return multiplayerRepository.findWaitingRooms();
};

// Return active rooms and mark any room as finished when its linked game session already ended.
export const getActiveRooms = async () => {
	const rooms = await multiplayerRepository.findActiveRooms();
	return Promise.all(rooms.map(async (room) => {
		if (room.status === "playing" && room.sessionId) {
			const session = await gameInterface.GameInterface.getSessionById(room.sessionId);
			if (session && (session.result || session.endTime)) {
				const endTime = session.endTime || new Date();
				return multiplayerRepository.updateRoom(room._id, {
					status: "finished",
					endTime,
				});
			}
		}
		return room;
	}));
};

// Join a waiting room as player2, allocate the final marker, and create the linked game session.
export const joinRoom = async (roomId, userId, marker) => {
	const room = await multiplayerRepository.findRoomById(roomId);
	if (!room) throw new AppError("Room not found.", 404);
	if (room.status !== "waiting") throw new AppError("Room is not available.", 400);
	if (room.player1._id.toString() === userId) throw new AppError("Cannot join your own room.", 400);

	if (marker && !ALL_MARKERS.includes(marker)) {
		throw new AppError("Invalid marker selected.", 400);
	}
	if (marker && marker === room.player1Marker) {
		throw new AppError("That marker is already taken by Player 1.", 400);
	}

	const availableMarkers = ALL_MARKERS.filter((m) => m !== room.player1Marker);
	const selectedMarker = marker || availableMarkers[0] || "X";

	// Create a GameSession for the multiplayer match via the game interface
	const session = await gameInterface.createMultiplayerSession({
		player1: room.player1._id,
		player2: userId,
		boardSize: room.boardSize,
	});

	const updatedRoom = await multiplayerRepository.updateRoom(roomId, {
		player2: userId,
		player2Marker: selectedMarker,
		sessionId: session._id,
		status: "playing",
		startTime: new Date(),
	});
	return enrichRoomAvatars(updatedRoom);
};

// Close a room while preserving existing finished rooms unless a different terminal status is required.
export const closeRoom = async (roomId, status = "cancelled") => {
	const room = await multiplayerRepository.findRoomById(roomId);
	if (!room) return null;
	if (room.status === "finished" && status === "cancelled") return room;
	if (room.status === status && room.endTime) return room;
	return multiplayerRepository.closeRoom(roomId, status, room.endTime || new Date());
};

// Fetch a single room with avatar enrichment for the detail view.
export const getRoom = async (roomId) => {
	const room = await multiplayerRepository.findRoomById(roomId);
	if (!room) throw new AppError("Room not found.", 404);
	return enrichRoomAvatars(room);
};

// ── Move processing (wraps game interface for the socket handler) ──────

// Apply a multiplayer move to the underlying game session and finish the room when the session ends.
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

	if (moveResult.winner || moveResult.draw) {
		// Mark the multiplayer room finished when the game session ends.
		const room = await multiplayerRepository.findRoomBySessionId(session._id);
		if (room) {
			await multiplayerRepository.updateRoom(room._id, {
				status: "finished",
				endTime: new Date(),
			});
		}
	}

	return {
		board: moveResult.board,
		turn: playerId === "player1" ? "player2" : "player1",
		winner: moveResult.winner,
		winLine: moveResult.winLine,
		draw: moveResult.draw,
		notation: notation || "",
	};
};
