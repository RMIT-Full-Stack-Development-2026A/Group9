import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '../services/socket.service.js';

export function useChat(roomId, connected) {
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);

	// Register chat:message listener once the socket is connected.
	// We depend on `connected` because the socket doesn't exist
	// yet when this hook first mounts — `connected` flips to true
	// when the socket actually connects.
	useEffect(() => {
		if (!connected) return;

		const socket = getSocket();
		if (!socket) return;

		const handler = (message) => {
			setMessages((prev) => [...prev, message]);
		};

		socket.on('chat:message', handler);

		return () => {
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

		// Show message locally immediately (optimistic)
		setMessages((prev) => [...prev, {
			userId: 'me',
			username: 'You',
			text: text.trim(),
			timestamp: new Date().toISOString(),
		}]);

		// Server broadcasts to the other player via socket.to()
		socket.emit('chat:message', { text: text.trim() });
	}, []);

	return { messages, sendMessage, messagesEndRef };
}
