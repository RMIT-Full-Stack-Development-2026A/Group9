/**
 * ============================================================================
 * CHAT SOCKET HANDLER (Real-Time Chat During Games)
 * ============================================================================
 * Purpose: Handles in-game chat messages between players, with validation
 * and basic spam prevention.
 */

export default function registerChatSocketHandlers(io, socket) {
	const CHAT_MAX_LENGTH = 500;
	const CHAT_RATE_LIMIT_MS = 500; // Min time between messages

	// Track last message time per socket to prevent spam
	const lastMessageTime = new Map();

	/**
	 * Player joins chat room for a game session
	 */
	socket.on('chat:join', ({ sessionId, roomId } = {}) => {
		try {
			if (!sessionId || !roomId) {
				socket.emit('error', { message: 'sessionId and roomId required' });
				return;
			}

			socket.chatRoom = roomId;
			socket.chatSessionId = sessionId;
			socket.join(roomId);

			// Notify others that player joined chat
			io.to(roomId).emit('chat:user_joined', {
				userId: socket.userId,
				timestamp: new Date().toISOString(),
			});
		} catch (err) {
			socket.emit('error', { message: err.message });
		}
	});

	/**
	 * Player sends a chat message
	 * Validates message length and rate limits
	 */
	socket.on('chat:send', ({ sessionId, message } = {}) => {
		try {
			if (!sessionId || !message) {
				socket.emit('error', { message: 'sessionId and message required' });
				return;
			}

			// Validate message is a string
			if (typeof message !== 'string') {
				socket.emit('error', { message: 'Message must be a string' });
				return;
			}

			// Trim and validate
			const trimmedMessage = message.trim();
			if (!trimmedMessage || trimmedMessage.length === 0) {
				socket.emit('error', { message: 'Message cannot be empty' });
				return;
			}

			if (trimmedMessage.length > CHAT_MAX_LENGTH) {
				socket.emit('error', { message: `Message exceeds ${CHAT_MAX_LENGTH} character limit` });
				return;
			}

			// Rate limiting - prevent spam
			const now = Date.now();
			const lastTime = lastMessageTime.get(socket.id) || 0;
			if (now - lastTime < CHAT_RATE_LIMIT_MS) {
				socket.emit('error', { message: 'Message sent too quickly. Please wait.' });
				return;
			}

			lastMessageTime.set(socket.id, now);

			// Broadcast message to room
			const roomId = socket.chatRoom || sessionId;
			io.to(roomId).emit('chat:message_received', {
				userId: socket.userId,
				message: trimmedMessage,
				timestamp: new Date().toISOString(),
			});
		} catch (err) {
			socket.emit('error', { message: err.message });
		}
	});

	/**
	 * Player leaves chat (typically when game ends)
	 */
	socket.on('chat:leave', ({ sessionId } = {}) => {
		try {
			if (!sessionId || !socket.chatRoom) {
				return;
			}

			socket.to(socket.chatRoom).emit('chat:user_left', {
				userId: socket.userId,
				timestamp: new Date().toISOString(),
			});

			socket.leave(socket.chatRoom);
			lastMessageTime.delete(socket.id);
		} catch (err) {
			console.error('Error in chat:leave handler:', err);
		}
	});

	/**
	 * Clean up on disconnect
	 */
	socket.on('disconnect', () => {
		lastMessageTime.delete(socket.id);
	});
}