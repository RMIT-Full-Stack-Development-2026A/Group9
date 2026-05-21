import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../../config/api.config.js';

/*
  socket.service.js
  - Lightweight wrapper around `socket.io-client` to manage a single
	shared socket instance for the app. Exported helpers:
	* `connectSocket()` — ensure a connection exists and return it
	* `getSocket()` — read-only accessor for the current socket
	* `disconnectSocket()` — teardown and cleanup listeners
*/
let socket = null;

export function connectSocket() {
	// Reuse existing connected socket if present
	if (socket?.connected) return socket;

	// Attach auth token from localStorage for server handshake
	const token = localStorage.getItem('authToken');
	socket = io(API_BASE_URL, {
		auth: { token },
		transports: ['websocket', 'polling'],
	});

	// Basic lifecycle logging for developer visibility
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
	// Return the shared socket instance (may be null)
	return socket;
}

export function disconnectSocket() {
	// Cleanly remove listeners and disconnect to avoid background activity
	if (socket) {
		socket.removeAllListeners();
		socket.disconnect();
		socket = null;
	}
}
