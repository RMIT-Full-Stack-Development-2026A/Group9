import http from "../../utils/http.helper.js";
import { ADMIN_ROUTES } from "../../config/api.config.js";

export const getAllPlayers = () => http.get(ADMIN_ROUTES.PLAYERS);
export const togglePlayerStatus = (id, isActive) =>
  http.put(`${ADMIN_ROUTES.PLAYERS}/${id}/status`, { isActive });
export const getAllGameRooms = (params) =>
  http.get(ADMIN_ROUTES.GAME_ROOMS, { params });
export const closeGameRoom = (id) =>
  http.put(`${ADMIN_ROUTES.GAME_ROOMS}/${id}/close`);
