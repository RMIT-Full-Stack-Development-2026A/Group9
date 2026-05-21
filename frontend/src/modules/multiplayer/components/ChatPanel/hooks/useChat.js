import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '../../../services/socket.service.js';

/*
  useChat
  - Lightweight hook that subscribes to `chat:message` socket events for the
	current room and exposes `messages`, `sendMessage`, and `messagesEndRef`.
  - Behavior:
	- Registers a socket listener when `connected` becomes true.
	- Auto-scrolls to the bottom when new messages arrive.
	- `sendMessage` performs an optimistic local append then emits to server.
*/
export function useChat(roomId, connected) {
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);

	// Register chat:message listener once the socket is connected
	useEffect(() => {
		if (!connected) return;

		const socket = getSocket();
		if (!socket) return;

		const handler = (message) => {
			// Append incoming message from server
			setMessages((prev) => [...prev, message]);
		};

		socket.on('chat:message', handler);

		return () => {
			// Clean up when disconnected or unmounted
			socket.off('chat:message', handler);
		};
	}, [connected]);

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = useCallback((text) => {
		if (!text?.trim()) return;
		const socket = getSocket();
		if (!socket) return;

		// Show message locally immediately (optimistic UI) so sender sees it
		setMessages((prev) => [...prev, {
			userId: 'me',
			username: 'You',
			text: text.trim(),
			timestamp: new Date().toISOString(),
		}]);

		// Emit to server; server will broadcast back to other clients
		socket.emit('chat:message', { text: text.trim() });
	}, []);

	return { messages, sendMessage, messagesEndRef };
}
