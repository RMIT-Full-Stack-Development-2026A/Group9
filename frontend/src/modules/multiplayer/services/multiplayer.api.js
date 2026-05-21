import { api } from '../../../services/api.js';
import { API_ROUTES } from '../../../config/apiRoutes.js';

/*
  multiplayer.api.js
  - Thin HTTP adapter for multiplayer-related backend endpoints.
  - Each function returns the `api` promise so callers (hooks/pages)
	can inspect `response.data` or handle errors uniformly.
*/
export function createRoom(data) {
	// POST to create a new waiting room with provided settings
	return api.post(API_ROUTES.multiplayer.rooms, data);
}

export function getWaitingRooms() {
	// GET list of rooms currently waiting for players
	return api.get(API_ROUTES.multiplayer.rooms);
}

export function getActiveRooms() {
	// GET list of actively playing rooms (in-game)
	return api.get(API_ROUTES.multiplayer.roomsActive);
}

export function joinRoom(roomId, marker) {
	// POST join request for a room, providing chosen marker for player2
	return api.post(API_ROUTES.multiplayer.joinRoom(roomId), { marker });
}

export function closeRoom(roomId) {
	// POST request to close a waiting room (called by the creator)
	return api.post(API_ROUTES.multiplayer.closeRoom(roomId));
}

export function getRoom(roomId) {
	// GET a single room's details by id
	return api.get(API_ROUTES.multiplayer.roomById(roomId));
}
