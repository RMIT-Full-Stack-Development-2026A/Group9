import * as multiplayerService from "../services/multiplayer.service.js";
import * as multiplayerInterface from "../interface/multiplayer.interface.js";
import * as userService from "../../user/services/user.service.js";
import { getSocketServer } from "../../../socket/index.js";

// Attach missing avatar fields to player objects before formatting the room response.
const enrichPlayerAvatars = async (room) => {
	const obj = room.toObject ? room.toObject() : room;
	if (obj.player1 && !obj.player1.avatar) {
		const profile = await userService.findUserById(obj.player1._id);
		if (profile?.avatar) obj.player1.avatar = profile.avatar;
	}
	if (obj.player2 && !obj.player2.avatar) {
		const profile = await userService.findUserById(obj.player2._id);
		if (profile?.avatar) obj.player2.avatar = profile.avatar;
	}
	return obj;
};

// Shape a full room document into the response expected by the room detail UI.
const roomResponse = async (room) => {
	const obj = await enrichPlayerAvatars(room);
	return {
		_id: obj._id,
		roomNumber: obj.roomNumber,
		player1: obj.player1
			? { _id: obj.player1._id, username: obj.player1.username, avatar: obj.player1.avatar }
			: null,
		player2: obj.player2
			? { _id: obj.player2._id, username: obj.player2.username, avatar: obj.player2.avatar }
			: null,
		status: obj.status,
		boardSize: obj.boardSize,
		boardStyle: obj.boardStyle || "Classic",
		player1Marker: obj.player1Marker,
		player2Marker: obj.player2Marker,
		firstPlayer: obj.firstPlayer || "player1",
		sessionId: obj.sessionId?.toString?.() || obj.sessionId || null,
		startTime: obj.startTime,
		endTime: obj.endTime,
	};
};

// Shape a room into the smaller list-item response used by waiting-room lists.
const roomListResponse = (room) => {
	const obj = room.toObject ? room.toObject() : room;
	return {
		_id: obj._id,
		roomNumber: obj.roomNumber,
		player1: obj.player1
			? { _id: obj.player1._id, username: obj.player1.username }
			: null,
		status: obj.status,
		boardSize: obj.boardSize,
		boardStyle: obj.boardStyle || "Classic",
		player1Marker: obj.player1Marker || 'X',
		startTime: obj.startTime,
	};
};

// Create a room and return the fully formatted room payload.
export const createRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.createRoom(req.user.id, req.body || {});
		res.status(201).json(await roomResponse(room));
	} catch (error) {
		next(error);
	}
};

// Return all waiting rooms in compact list form.
export const getWaitingRooms = async (req, res, next) => {
	try {
		const rooms = await multiplayerService.getWaitingRooms();
		res.json(rooms.map(roomListResponse));
	} catch (error) {
		next(error);
	}
};

// Return active rooms using the interface layer's DTO mapping.
export const getActiveRooms = async (req, res, next) => {
	try {
		const rooms = await multiplayerInterface.getActiveRooms();
		res.json(rooms);
	} catch (error) {
		next(error);
	}
};

// Join an existing waiting room and return the updated room payload.
export const joinRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.joinRoom(req.params.id, req.user.id, req.body?.marker);
		res.json(await roomResponse(room));
	} catch (error) {
		next(error);
	}
};

// Close a room and notify any socket listeners that the room is finished.
export const closeRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.closeRoom(req.params.id);
		const io = getSocketServer();
		if (io && room?._id) {
			io.to(`room:${room._id}`).emit("room:closed", {
				roomId: room._id.toString(),
			});
		}
		res.json({ success: true, room: await roomResponse(room) });
	} catch (error) {
		next(error);
	}
};

// Fetch a single room by id and return the formatted response.
export const getRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.getRoom(req.params.id);
		res.json(await roomResponse(room));
	} catch (error) {
		next(error);
	}
};
