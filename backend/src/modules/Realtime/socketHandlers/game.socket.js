export default function registerGameSocketHandlers(io, socket) {
	socket.on("game:join", ({ roomId } = {}) => {
		if (!roomId) {
			return;
		}

		socket.join(roomId);
		io.to(roomId).emit("game:system", {
			message: "A player joined the room",
			socketId: socket.id,
			timestamp: new Date().toISOString(),
		});
	});

	socket.on("game:move", ({ roomId, move } = {}) => {
		if (!roomId || move === undefined) {
			return;
		}

		io.to(roomId).emit("game:move", {
			socketId: socket.id,
			move,
			timestamp: new Date().toISOString(),
		});
	});

	socket.on("game:leave", ({ roomId } = {}) => {
		if (!roomId) {
			return;
		}

		socket.leave(roomId);
		io.to(roomId).emit("game:system", {
			message: "A player left the room",
			socketId: socket.id,
			timestamp: new Date().toISOString(),
		});
	});
}