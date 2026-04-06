import * as adminService from "./admin.service.js";

/**
 * Admin module interface — the only entry point for other modules.
 * Other modules must NOT import admin services, repositories, or models directly.
 * (Architecture requirement A.3.1)
 */

export const getAllPlayers = () => adminService.getAllPlayers();

export const togglePlayerStatus = (playerId, isActive) =>
  adminService.togglePlayerStatus(playerId, isActive);

export const getAllGameRooms = (query) => adminService.getAllGameRooms(query);

export const closeGameRoom = (roomId) => adminService.closeGameRoom(roomId);
