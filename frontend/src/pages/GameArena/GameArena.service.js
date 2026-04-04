import http from "../../utils/http.helper.js";
import { GAME_ROUTES, MULTIPLAYER_ROUTES } from "../../config/api.config.js";

export const createSession = (data) => http.post(GAME_ROUTES.SESSIONS, data);
export const endSession = (id, data) => http.put(`${GAME_ROUTES.SESSIONS}/${id}/end`, data);
export const getSession = (id) => http.get(`${GAME_ROUTES.SESSIONS}/${id}`);
export const recordMove = (data) => http.post(GAME_ROUTES.MOVES, data);
export const getGameMoves = (id) => http.get(`${GAME_ROUTES.SESSIONS}/${id}/moves`);
export const getAIMove = (data) => http.post(GAME_ROUTES.AI_MOVE, data);

export const getWaitingRooms = () => http.get(MULTIPLAYER_ROUTES.ROOMS);
export const createRoom = (data) => http.post(MULTIPLAYER_ROUTES.ROOMS, data);
export const joinRoom = (id, data) => http.post(`${MULTIPLAYER_ROUTES.ROOMS}/${id}/join`, data);
export const getRoom = (id) => http.get(`${MULTIPLAYER_ROUTES.ROOMS}/${id}`);