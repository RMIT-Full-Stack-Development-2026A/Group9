import * as userFacade from "../users/user.facade.js";
import * as gameFacade from "../game/game.facade.js";
import { AppError } from "../../shared/errors/AppError.js";
import { toPlayerListDTO } from "./admin.dto.js";

/**
 * Get all players (Req 6.1.1)
 * Uses user facade interface (A.3.1) instead of direct model access.
 */
export const getAllPlayers = async () => {
  const players = await userFacade.findAllPlayers();
  return players.map(toPlayerListDTO);
};

/**
 * Toggle player active status (Req 6.2.1)
 * Uses user facade interface (A.3.1) instead of direct model access.
 */
export const togglePlayerStatus = async (playerId, isActive) => {
  const user = await userFacade.getUserById(playerId);
  if (!user) throw new AppError("Player not found.", 404);
  if (user.role === "admin") throw new AppError("Cannot deactivate an admin.", 403);

  const updated = await userFacade.setActiveStatus(playerId, isActive);
  return toPlayerListDTO(updated);
};

/**
 * Get all online game rooms (Req 6.3.1)
 * Uses game facade interface (A.3.1) instead of direct model access.
 */
export const getAllGameRooms = async (query = {}) => {
  const { search } = query;
  let rooms = await gameFacade.getOnlineGameRooms();

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
 * Uses game facade interface (A.3.1) instead of direct model access.
 */
export const closeGameRoom = async (roomId) => {
  const room = await gameFacade.getGameSessionById(roomId);
  if (!room) throw new AppError("Game room not found.", 404);
  if (room.endTime) throw new AppError("Game room is already closed.", 400);

  return gameFacade.closeGameSession(roomId);
};
