import { Server } from "socket.io";
import registerGameSocketHandlers from "./socketHandlers/game.socket.js";
import registerChatSocketHandlers from "./socketHandlers/chat.socket.js";

export const initSocket = (httpServer) => {
	const io = new Server(httpServer, {
		cors: {
			origin: process.env.SOCKET_CORS_ORIGIN || "*",
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		registerGameSocketHandlers(io, socket);
		registerChatSocketHandlers(io, socket);

		socket.on("disconnect", () => {
			io.emit("system:user-disconnected", { socketId: socket.id });
		});
	});

	return io;
};