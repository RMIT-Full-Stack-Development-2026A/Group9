import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../../config/api.config.js';

let socket = null;

export function connectSocket() {
	if (socket?.connected) return socket;

	const token = localStorage.getItem('authToken');
	socket = io(API_BASE_URL, {
		auth: { token },
		transports: ['websocket', 'polling'],
	});

	socket.on('connect', () => {
		console.log('[Socket] Connected:', socket.id);
	});

	socket.on('connect_error', (error) => {
		console.error('[Socket] Connection error:', error.message);
	});

	socket.on('disconnect', (reason) => {
		console.log('[Socket] Disconnected:', reason);
	});

	return socket;
}

export function getSocket() {
	return socket;
}

export function disconnectSocket() {
	if (socket) {
		socket.removeAllListeners();
		socket.disconnect();
		socket = null;
	}
}
