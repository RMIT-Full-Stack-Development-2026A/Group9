import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '../services/socket.service.js';

export function useChat(roomId) {
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);

	// Register chat:message listener when socket is ready
	useEffect(() => {
		const checkAndRegister = () => {
			const socket = getSocket();
			if (!socket || !socket.connected) return;

			const handler = (message) => {
				setMessages((prev) => [...prev, message]);
			};

			socket.on('chat:message', handler);

			return () => {
				socket.off('chat:message', handler);
			};
		};

		const cleanup = checkAndRegister();

		// Re-register on connect
		const socket = getSocket();
		if (socket) {
			socket.on('connect', () => {
				checkAndRegister();
			});
		}

		return () => {
			cleanup?.();
			if (socket) {
				socket.off('connect');
				socket.off('chat:message');
			}
		};
	}, []);

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = useCallback((text) => {
		if (!text?.trim()) return;
		const socket = getSocket();
		if (!socket) return;

		// Show message locally immediately
		const msg = {
			userId: 'me',
			username: 'You',
			text: text.trim(),
			timestamp: new Date().toISOString(),
		};
		setMessages((prev) => [...prev, msg]);

		// Server broadcasts to the other player via socket.to()
		socket.emit('chat:message', { text: text.trim() });
	}, []);

	return { messages, sendMessage, messagesEndRef };
}
