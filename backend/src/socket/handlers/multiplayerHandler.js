import * as multiplayerInterface from "../../modules/multiplayer/interface/multiplayer.interface.js";

export function registerMultiplayerHandlers(io, socket) {
	// ── Join a game room ──────────────────────────────────────────────
	// When a client requests to join a room, we validate the room exists
	// server-side (do not trust client-supplied state), add the socket to
	// the room namespace and notify the other participant(s) so they can
	// update UI (board, opponent info, marker).
	socket.on("room:join", async ({ roomId }) => {
		try {
			const room = await multiplayerInterface.getRoom(roomId);
			if (!room) {
				socket.emit("error", { message: "Room not found" });
				return;
			}

			socket.join(`room:${roomId}`);
			socket.currentRoom = roomId;

			// Notify the existing player that someone joined.
			// Include session + opponent info so player 1 can update
			// board, marker display, and player name immediately.
			const opponentName =
				room.player2?.username ||
				socket.user.username ||
				socket.user.email ||
				"Player 2";
			const opponentAvatar = room.player2?.avatar || null;

			// Emit to everyone in the room except this socket
			socket.to(`room:${roomId}`).emit("room:player-joined", {
				roomId,
				sessionId: room.sessionId?.toString() || null,
				boardSize: room.boardSize,
				opponentName,
				opponentAvatar,
				opponentMarker: room.player2Marker,
			});

			console.log(`[Socket] User ${socket.user.id} joined room ${roomId}`);
		} catch (error) {
			socket.emit("error", { message: error.message });
		}
	});

	// ── Leave / abort a game room ──────────────────────────────────────
	// Handles voluntary leaves and aborts. This closes server-side room
	// state, notifies remaining clients and forcibly removes sockets from
	// the room namespace.
	socket.on("room:leave", async ({ roomId }, ack) => {
		try {
			const targetRoom = roomId || socket.currentRoom;
			if (!targetRoom) return;

			// Close the room on the backend
			try {
				await multiplayerInterface.closeRoom(targetRoom);
			} catch {}

			// Notify everyone still in the room to leave
			io.to(`room:${targetRoom}`).emit("room:closed", {
				roomId: targetRoom,
			});

			// Kick all sockets out of the room
			const roomSockets = io.sockets.adapter.rooms.get(`room:${targetRoom}`);
			if (roomSockets) {
				for (const socketId of roomSockets) {
					const s = io.sockets.sockets.get(socketId);
					if (s) s.leave(`room:${targetRoom}`);
				}
			}

			console.log(`[Socket] Room ${targetRoom} closed by user ${socket.user.id}`);
			if (typeof ack === "function") {
				ack({ success: true, roomId: targetRoom });
			}
		} catch (error) {
			socket.emit("error", { message: error.message });
			if (typeof ack === "function") {
				ack({ success: false, message: error.message });
			}
		}
	});

	// ── Game move ─────────────────────────────────────────────────────
	// Authoritative move processing: the server calls into the multiplayer
	// domain service to validate and execute the move, then broadcasts the
	// resulting canonical game state to all clients in the room. This avoids
	// client-side cheating and keeps both players in-sync.
	socket.on("game:move", async ({ sessionId, idx, marker, playerId }) => {
		console.log(`[game:move] Received from ${socket.user?.id?.slice(-6)}: sessionId=${sessionId?.slice(-6)} idx=${idx} marker=${marker} playerId=${playerId}`);
		try {
			const result = await multiplayerInterface.processMove(
				sessionId, idx, marker, playerId || socket.user.id
			);

			const currentRoom = socket.currentRoom;
			console.log(`[game:move] Broadcasting to room:${currentRoom}, turn=${result.turn}`);

			// Broadcast the canonical state to the entire room
			io.to(`room:${currentRoom}`).emit("game:state-update", {
				board: result.board,
				turn: result.turn,
				winner: result.winner,
				winLine: result.winLine,
				draw: result.draw,
				lastMove: { idx, marker, playerId: playerId || socket.user.id, notation: result.notation },
			});

			if (result.winner || result.draw) {
				io.to(`room:${socket.currentRoom}`).emit("game:over", {
					winner: result.winner,
					winLine: result.winLine,
					draw: result.draw,
				});
			}
		} catch (error) {
			console.error(`[game:move] ERROR:`, error.message);
			socket.emit("error", { message: error.message });
		}
	});

	// ── Chat message ──────────────────────────────────────────────────
	// Simple room-scoped chat: sanitize and broadcast text messages to the
	// socket's current room. We avoid trusting a client-supplied roomId and
	// instead use the server-known `socket.currentRoom` for reliability.
	socket.on("chat:message", ({ text }) => {
		if (!text || typeof text !== "string" || !text.trim()) return;

		const message = {
			userId: socket.user.id,
			username: socket.user.username || socket.user.email || "Player",
			text: text.trim(),
			timestamp: new Date().toISOString(),
		};

		// Always broadcast to the socket's current room (more reliable than client-supplied roomId)
		const room = socket.currentRoom;
		if (!room) return;

		socket.to(`room:${room}`).emit("chat:message", message);
	});

	// ── Disconnect ───────────────────────────────────────────────────-
	// Clean up when a socket disconnects: inform remaining players and
	// optionally close the room if it's now empty. Note: the room-close
	// call should be resilient (errors ignored) because disconnects can
	// happen during network flaps.
	socket.on("disconnect", async () => {
		if (socket.currentRoom) {
			socket.to(`room:${socket.currentRoom}`).emit("room:player-left", {
				roomId: socket.currentRoom,
				userId: socket.user?.id,
			});

			// If no sockets left in the room, close it on the backend
			const roomSockets = io.sockets.adapter.rooms.get(`room:${socket.currentRoom}`);
			if (!roomSockets || roomSockets.size === 0) {
				try {
					// Note: multiplayerService is intentionally resilient here
					await multiplayerService.closeRoom(socket.currentRoom);
					console.log(`[Socket] Room ${socket.currentRoom} closed (empty)`);
				} catch {}
			}
		}
	});
}
