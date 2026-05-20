import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { hashSessionToken } from "../modules/auth/utils/sessionToken.util.js";
import * as authInterface from "../modules/auth/interface/auth.interface.js";
import * as userInterface from "../modules/user/interface/user.interface.js";
import * as tokenBlacklistService from "../shared/security/tokenBlacklist.service.js";
import { registerMultiplayerHandlers } from "./handlers/multiplayerHandler.js";

let ioInstance = null;

export function getSocketServer() {
	return ioInstance;
}

export function initSocket(httpServer) {
	const io = new Server(httpServer, {
		cors: {
			origin: ["http://localhost:5173", "http://localhost:5174"],
			credentials: true,
		},
	});
	ioInstance = io;

	// JWT authentication middleware on socket connection
	io.use(async (socket, next) => {
		try {
			const token = socket.handshake.auth?.token || "";

			if (!token) {
				return next(new Error("Authentication required"));
			}

			if (tokenBlacklistService.isBlacklisted(token)) {
				return next(new Error("Token has been revoked"));
			}

			const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");
			const tokenHash = hashSessionToken(token);
			const session = await authInterface.findActiveSession(tokenHash);

			if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
				return next(new Error("Authentication session has expired"));
			}

			const userId = payload.sub || payload.id || payload.userId;
			const user = userId ? await userInterface.findUserById(userId) : null;

			if (!user || user.isActive === false) {
				return next(new Error("Account is inactive"));
			}

			socket.user = {
				id: userId,
				role: payload.role || "player",
				email: payload.email,
				username: user?.username,
			};

			next();
		} catch (error) {
			next(new Error("Invalid or expired authentication token"));
		}
	});

	io.on("connection", (socket) => {
		console.log(`[Socket] User ${socket.user?.id} connected (${socket.id})`);

		// Join a personal room for direct messaging
		socket.join(`user:${socket.user.id}`);

		// Register multiplayer event handlers
		registerMultiplayerHandlers(io, socket);

		socket.on("disconnect", () => {
			console.log(`[Socket] User ${socket.user?.id} disconnected (${socket.id})`);
		});
	});

	console.log("[Socket] Socket.io initialized");
	return io;
}
