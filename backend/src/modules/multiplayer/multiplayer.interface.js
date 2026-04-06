import * as multiplayerService from "./multiplayer.service.js";

/**
 * Multiplayer module interface — the only entry point for other modules.
 * Other modules must NOT import multiplayer services, repositories, or models directly.
 * (Architecture requirement A.3.1)
 */

export const createRoom = (userId, options) => multiplayerService.createRoom(userId, options);

export const getWaitingRooms = () => multiplayerService.getWaitingRooms();

export const getActiveRooms = () => multiplayerService.getActiveRooms();

export const joinRoom = (roomId, userId, marker) => multiplayerService.joinRoom(roomId, userId, marker);

export const closeRoom = (roomId) => multiplayerService.closeRoom(roomId);

export const getRoom = (roomId) => multiplayerService.getRoom(roomId);
