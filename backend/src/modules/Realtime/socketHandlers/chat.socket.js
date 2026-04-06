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