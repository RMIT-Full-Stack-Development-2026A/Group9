/**
 * Chat socket handler for real-time in-game chat (Req 4.3.2)
 */
export const setupChatSocket = (io, socket) => {
  socket.on("chat:message", ({ roomId, message }) => {
    const chatMessage = {
      userId: socket.data.userId,
      username: socket.data.username,
      message,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to everyone in the room including sender
    io.to(roomId).emit("chat:newMessage", chatMessage);
  });

  socket.on("chat:typing", ({ roomId }) => {
    socket.to(roomId).emit("chat:userTyping", {
      username: socket.data.username,
    });
  });

  socket.on("chat:stopTyping", ({ roomId }) => {
    socket.to(roomId).emit("chat:userStoppedTyping", {
      username: socket.data.username,
    });
  });
};
