import * as multiplayerService from "../services/multiplayer.service.js";

export const createRoom = (userId, options) => multiplayerService.createRoom(userId, options);

export const getWaitingRooms = () => multiplayerService.getWaitingRooms();

export const getActiveRooms = () => multiplayerService.getActiveRooms();

export const joinRoom = (roomId, userId, marker) => multiplayerService.joinRoom(roomId, userId, marker);

export const closeRoom = (roomId) => multiplayerService.closeRoom(roomId);

export const getRoom = (roomId) => multiplayerService.getRoom(roomId);
