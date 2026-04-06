import * as userInterface from "../users/user.interface.js";
import * as gameInterface from "../game/game.interface.js";
import * as adminRepository from "./admin.repository.js";
import { AppError } from "../../shared/errors/AppError.js";

/**
 * Get all players (Req 6.1.1)
 * Uses user interface (A.3.1) instead of direct model access.
 */
export const getAllPlayers = async () => {
  return userInterface.findAllPlayers();
};

/**
 * Toggle player active status (Req 6.2.1)
 * Uses user interface (A.3.1) instead of direct model access.
 */
export const togglePlayerStatus = async (playerId, isActive, adminId) => {
  const user = await userInterface.getUserById(playerId);
  if (!user) throw new AppError("Player not found.", 404);
  if (user.role === "admin") throw new AppError("Cannot deactivate an admin.", 403);

  const updated = await userInterface.setActiveStatus(playerId, isActive);

  // Log admin action
  await adminRepository.logAction({
    adminId,
    actionType: isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
    targetUserId: playerId,
  });

  return updated;
};

/**
 * Get all online game rooms (Req 6.3.1)
 * Uses game interface (A.3.1) instead of direct model access.
 */
export const getAllGameRooms = async (query = {}) => {
  const { search } = query;
  let rooms = await gameInterface.getOnlineGameRooms();

  // Search by room number or player name (Req 6.3.2)
  if (search) {
    const searchLower = search.toLowerCase();
    rooms = rooms.filter((room) => {
      if (String(room.sessionNumber).includes(searchLower)) return true;
      if (room.players.some((p) => p.username?.toLowerCase().includes(searchLower)))
        return true;
      return false;
    });
  }

  return rooms.map((room) => ({
    _id: room._id,
    roomNumber: room.sessionNumber,
    player1: room.players[0] ? { username: room.players[0].username } : null,
    player2: room.players[1] ? { username: room.players[1].username } : null,
    boardSize: room.boardSize,
    status: room.endTime ? "closed" : room.players.length < 2 ? "waiting" : "playing",
    startTime: room.startTime,
    endTime: room.endTime || null,
    result: room.result,
  }));
};

/**
 * Close an active game room (Req 6.3.3)
 * Uses game interface (A.3.1) instead of direct model access.
 */
export const closeGameRoom = async (roomId, adminId) => {
  const room = await gameInterface.getGameSessionById(roomId);
  if (!room) throw new AppError("Game room not found.", 404);
  if (room.endTime) throw new AppError("Game room is already closed.", 400);

  // Log admin action
  await adminRepository.logAction({
    adminId,
    actionType: "CLOSE_ROOM",
    targetRoomId: roomId,
  });

  return gameInterface.closeGameSession(roomId);
};
