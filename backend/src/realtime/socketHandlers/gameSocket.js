/**
 * Game socket handler for real-time multiplayer (Req 4.3.1)
 */
export const setupGameSocket = (io, socket) => {
  // Join a game room
  socket.on("game:join", ({ roomId, userId, username }) => {
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.userId = userId;
    socket.data.username = username;

    // Notify the other player in the room
    socket.to(roomId).emit("game:playerJoined", { userId, username });
    console.log(`${username} joined room ${roomId}`);
  });

  // Player selects marker -> game starts (Req 4.3.1)
  socket.on("game:selectMarker", ({ roomId, marker }) => {
    socket.to(roomId).emit("game:markerSelected", {
      userId: socket.data.userId,
      marker,
    });
  });

  // Player makes a move
  socket.on("game:move", ({ roomId, row, col, marker, moveNumber }) => {
    socket.to(roomId).emit("game:moveMade", {
      userId: socket.data.userId,
      row,
      col,
      marker,
      moveNumber,
    });
  });

  // Game ended
  socket.on("game:end", ({ roomId, winnerId, result, winningCells }) => {
    io.to(roomId).emit("game:ended", { winnerId, result, winningCells });
  });

  // Player aborts
  socket.on("game:abort", ({ roomId }) => {
    socket.to(roomId).emit("game:aborted", {
      userId: socket.data.userId,
      username: socket.data.username,
    });
  });

  // Leave room
  socket.on("game:leave", ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("game:playerLeft", {
      userId: socket.data.userId,
      username: socket.data.username,
    });
  });
};
