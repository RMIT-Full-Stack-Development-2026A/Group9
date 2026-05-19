import { api } from '../../../services/api.js';

export function createRoom(data) {
	return api.post('/api/multiplayer/rooms', data);
}

export function getWaitingRooms() {
	return api.get('/api/multiplayer/rooms');
}

export function getActiveRooms() {
	return api.get('/api/multiplayer/rooms/active');
}

export function joinRoom(roomId, marker) {
	return api.post(`/api/multiplayer/rooms/${roomId}/join`, { marker });
}

export function closeRoom(roomId) {
	return api.post(`/api/multiplayer/rooms/${roomId}/close`);
}

export function getRoom(roomId) {
	return api.get(`/api/multiplayer/rooms/${roomId}`);
}
