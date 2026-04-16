/**
 * ============================================================================
 * GAME SOCKET HANDLER PURPOSE
 * ============================================================================
 * Purpose: Registers realtime game events for room join/move/leave flows.
 * Current logic is a lightweight starter and can be replaced by the Game or
 * Multiplayer feature assignee.
 */

export default function registerGameSocketHandlers(io, socket) {
	socket.on("game:join", ({ roomId } = {}) => {
		if (!roomId) return;

        const room = io.sockets.adapter.rooms.get(roomId);
        const numClients = room ? room.size : 0;

        // Limit to 2 players per room
        if (numClients >= 2) {
            socket.emit("game:error", { message: "Room is full" });
            return;
        }

        socket.join(roomId);

        // Notify the second player joined
        socket.to(roomId).emit("game:playerJoined", {
            message: "A second player has joined. The game can start!",
            playerId: socket.user.id,
            timestamp: new Date().toISOString(),
        });
		
		if (!gameStates[roomId]) {
            gameStates[roomId] = {
                board: Array(100).fill(null), // 10x10 grid
                nextTurn: "X"
            };
        }
    });

    socket.on("game:chooseMark", ({ roomId, mark }) => {
        if (!roomId || !mark) return;

        // Determine the opponent's mark automatically
        const opponentMark = mark === "X" ? "O" : "X";

        // Broadcast to EVERYONE in the room that the game has started.
        // We send back both marks so each client knows what to play as.
        io.to(roomId).emit("game:start", { 
            message: "The game has started!",
            chooserSocketId: socket.id,
            chosenMark: mark,
            opponentMark: opponentMark
        });
    });

	socket.on("game:move", ({ roomId, move }) => {
        const state = gameStates[roomId];
        if (!state) return;

        // 1. Validate: Is it the correct turn? Is the cell empty?
        const isValid = state.board[move.index] === null; 
        // Add more complex win/draw or turn logic here if needed

        if (isValid) {
            // 2. Update the authoritative state
            state.board[move.index] = move.mark;
            
            // 3. Synchronize: Broadcast the move to EVERYONE in the room
            io.to(roomId).emit("game:stateUpdate", {
                board: state.board,
                lastMove: move,
                nextTurn: state.nextTurn === "X" ? "O" : "X"
            });
        } else {
            // 4. Prevent: Inform the player their move was illegal
            socket.emit("game:error", { message: "Invalid move!" });
        }
    });
	
	socket.on("arena:getRooms", () => {
        // Grab all active rooms from Socket.io's internal adapter
        const activeRooms = [];
        const rooms = io.sockets.adapter.rooms;
        
        rooms.forEach((clients, roomId) => {
            // Filter out default socket ID rooms (each user has a personal room)
            if (roomId.length < 20) { // Assuming your custom room IDs are shorter than socket IDs
                activeRooms.push({
                    id: roomId,
                    players: clients.size
                });
            }
        });

        socket.emit("arena:roomsList", activeRooms);
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

const gameState = {}; 