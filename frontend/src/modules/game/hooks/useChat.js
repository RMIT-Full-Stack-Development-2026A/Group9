import { useEffect, useState } from 'react';

/**
 * useChat Hook
 * Manages real-time chat messages between players during a game
 * Depends on useMultiplayer hook's socket connection
 */
export const useChat = (socket, sessionId, userId, roomId) => {
	const [messages, setMessages] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!socket || !roomId) return;

		try {
			// Join chat room
			socket.emit('chat:join', { sessionId, roomId });

			// Listen for incoming messages
			socket.on('chat:message_received', (message) => {
				setMessages((prev) => [...prev, message]);
			});

			// Listen for user join notifications
			socket.on('chat:user_joined', (data) => {
				setMessages((prev) => [
					...prev,
					{
						isSystem: true,
						message: `User joined the chat`,
						timestamp: data.timestamp,
					},
				]);
			});

			// Listen for user leave notifications
			socket.on('chat:user_left', (data) => {
				setMessages((prev) => [
					...prev,
					{
						isSystem: true,
						message: `User left the chat`,
						timestamp: data.timestamp,
					},
				]);
			});

			// Listen for errors
			socket.on('error', (err) => {
				setError(err.message || 'Chat error occurred');
			});

			return () => {
				socket.emit('chat:leave', { sessionId });
				socket.off('chat:message_received');
				socket.off('chat:user_joined');
				socket.off('chat:user_left');
				socket.off('error');
			};
		} catch (err) {
			setError(err.message);
		}
	}, [socket, sessionId, roomId]);

	/**
	 * Send a chat message
	 */
	const sendMessage = (text) => {
		if (!socket || !text.trim()) {
			setError('Cannot send empty message');
			return;
		}

		setIsLoading(true);

		socket.emit('chat:send', {
			sessionId,
			message: text.trim(),
		});

		setIsLoading(false);
	};

	/**
	 * Clear chat history
	 */
	const clearMessages = () => {
		setMessages([]);
	};

	return {
		messages,
		error,
		isLoading,
		sendMessage,
		clearMessages,
	};
};

export default useChat;
