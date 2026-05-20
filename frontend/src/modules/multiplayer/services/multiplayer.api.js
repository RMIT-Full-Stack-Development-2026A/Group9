import { api } from '../../../services/api.js';
import { API_ROUTES } from '../../../config/apiRoutes.js';

export function createRoom(data) {
	return api.post(API_ROUTES.multiplayer.rooms, data);
}

export function getWaitingRooms() {
	return api.get(API_ROUTES.multiplayer.rooms);
}

export function getActiveRooms() {
	return api.get(API_ROUTES.multiplayer.roomsActive);
}

export function joinRoom(roomId, marker) {
	return api.post(API_ROUTES.multiplayer.joinRoom(roomId), { marker });
}

export function closeRoom(roomId) {
	return api.post(API_ROUTES.multiplayer.closeRoom(roomId));
}

export function getRoom(roomId) {
	return api.get(API_ROUTES.multiplayer.roomById(roomId));
}
