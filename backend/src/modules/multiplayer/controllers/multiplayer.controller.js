import * as multiplayerService from "../services/multiplayer.service.js";
import { toRoomDTO, toRoomListDTO } from "../dto/multiplayer.dto.js";

export const createRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.createRoom(req.user.id, req.body || {});
		res.status(201).json(toRoomDTO(room));
	} catch (error) {
		next(error);
	}
};

export const getWaitingRooms = async (req, res, next) => {
	try {
		const rooms = await multiplayerService.getWaitingRooms();
		res.json(rooms.map(toRoomListDTO));
	} catch (error) {
		next(error);
	}
};

export const getActiveRooms = async (req, res, next) => {
	try {
		const rooms = await multiplayerService.getActiveRooms();
		res.json(rooms.map(toRoomListDTO));
	} catch (error) {
		next(error);
	}
};

export const joinRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.joinRoom(req.params.id, req.user.id, req.body?.marker);
		res.json(toRoomDTO(room));
	} catch (error) {
		next(error);
	}
};

export const closeRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.closeRoom(req.params.id);
		res.json({ success: true, room: toRoomDTO(room) });
	} catch (error) {
		next(error);
	}
};

export const getRoom = async (req, res, next) => {
	try {
		const room = await multiplayerService.getRoom(req.params.id);
		res.json(toRoomDTO(room));
	} catch (error) {
		next(error);
	}
};
