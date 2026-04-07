/**
 * ============================================================================
 * CHAT SOCKET HANDLER PURPOSE
 * ============================================================================
 * Purpose: Registers realtime chat events for room participation and message
 * broadcast behavior.
 * Current logic is a lightweight starter and can be expanded by the assignee.
 */

export default function registerChatSocketHandlers(io, socket) {
	socket.on("chat:join", ({ roomId } = {}) => {
		if (!roomId) {
			return;
		}

		socket.join(roomId);
	});

	socket.on("chat:send", ({ roomId, message, sender } = {}) => {
		if (!roomId || !message) {
			return;
		}

		io.to(roomId).emit("chat:message", {
			sender: sender || "anonymous",
			message: String(message).trim(),
			socketId: socket.id,
			timestamp: new Date().toISOString(),
		});
	});
}