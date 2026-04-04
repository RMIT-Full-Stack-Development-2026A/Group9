import * as adminRepository from "./admin.repository.js";
import { AppError } from "../../shared/errors/AppError.js";

/**
 * Get all players (Req 6.1.1)
 */
export const getAllPlayers = async () => {
  return adminRepository.findAllPlayers();
};

/**
 * Toggle player active status (Req 6.2.1)
 */
export const togglePlayerStatus = async (playerId, isActive) => {
  const user = await adminRepository.findUserById(playerId);
  if (!user) throw new AppError("Player not found.", 404);
  if (user.role === "admin") throw new AppError("Cannot deactivate an admin.", 403);

  return adminRepository.updateUserStatus(playerId, isActive);
};

/**
 * Get all online game rooms (Req 6.3.1)
 */
export const getAllGameRooms = async (query = {}) => {
  const { search } = query;
  let rooms = await adminRepository.findAllGameRooms();

  // Search by room number or player name (Req 6.3.2)
  if (search) {
    const searchLower = search.toLowerCase();
    rooms = rooms.filter((room) => {
      if (String(room.sessionNumber).includes(searchLower)) return true;
      if (room.players.some((p) => p.username.toLowerCase().includes(searchLower)))
        return true;
      return false;
    });
  }

  return rooms.map((room) => ({
    _id: room._id,
    roomNumber: room.sessionNumber,
    player1: room.players[0]?.username || "—",
    player2: room.players[1]?.username || "Waiting...",
    startTime: room.startTime,
    endTime: room.endTime || null,
    result: room.result,
  }));
};

/**
 * Close an active game room (Req 6.3.3)
 */
export const closeGameRoom = async (roomId) => {
  const room = await adminRepository.findGameRoomById(roomId);
  if (!room) throw new AppError("Game room not found.", 404);
  if (room.endTime) throw new AppError("Game room is already closed.", 400);

  return adminRepository.closeGameRoom(roomId);
};
