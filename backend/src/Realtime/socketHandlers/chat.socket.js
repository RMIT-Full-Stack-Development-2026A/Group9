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

	socket.on("chat:send", async ({ roomId, message } = {}) => {
		if (!roomId || !message) {
			return;
		}

        io.to(roomId).emit("chat:message", {
            senderId: socket.user.id,
            message: String(message).trim(),
            timestamp: new Date().toISOString(),
        });
    });

    socket.on("chat:leave", ({ roomId } = {}) => {
        if (!roomId) {
            return;
        }

        socket.leave(roomId);
    });
}