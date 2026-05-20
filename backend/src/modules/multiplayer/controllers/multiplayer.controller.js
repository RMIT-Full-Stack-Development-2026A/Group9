import * as multiplayerService from "../services/multiplayer.service.js";

const roomResponse = (room) => {
	const obj = room.toObject ? room.toObject() : room;
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
		player1Marker: obj.player1Marker,
		player2Marker: obj.player2Marker,
		firstPlayer: obj.firstPlayer || "player1",
		sessionId: obj.sessionId?.toString?.() || obj.sessionId || null,
		startTime: obj.startTime,
		endTime: obj.endTime,
	};
};

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
		startTime: obj.startTime,
	};
};

export const createRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.createRoom(req.user.id, req.body || {});
		res.status(201).json(roomResponse(room));
	} catch (error) {
		next(error);
	}
};

export const getWaitingRooms = async (req, res, next) => {
	try {
		const rooms = await multiplayerService.getWaitingRooms();
		res.json(rooms.map(roomListResponse));
	} catch (error) {
		next(error);
	}
};

export const getActiveRooms = async (req, res, next) => {
	try {
		const rooms = await multiplayerService.getActiveRooms();
		res.json(rooms.map(roomListResponse));
	} catch (error) {
		next(error);
	}
};

export const joinRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.joinRoom(req.params.id, req.user.id, req.body?.marker);
		res.json(roomResponse(room));
	} catch (error) {
		next(error);
	}
};

export const closeRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.closeRoom(req.params.id);
		res.json({ success: true, room: roomResponse(room) });
	} catch (error) {
		next(error);
	}
};

export const getRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.getRoom(req.params.id);
		res.json(roomResponse(room));
	} catch (error) {
		next(error);
	}
};
