import { Server } from "socket.io";
import { setupGameSocket } from "./socketHandlers/gameSocket.js";
import { setupChatSocket } from "./socketHandlers/chatSocket.js";

let io;

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    setupGameSocket(io, socket);
    setupChatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => io;
