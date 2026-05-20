import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { hashSessionToken } from "../modules/auth/utils/sessionToken.util.js";
import * as authService from "../modules/auth/services/auth.service.js";
import * as tokenBlacklistService from "../shared/security/tokenBlacklist.service.js";
import { registerMultiplayerHandlers } from "./handlers/multiplayerHandler.js";

export function initSocket(httpServer) {
	const io = new Server(httpServer, {
		cors: {
			origin: ["http://localhost:5173", "http://localhost:5174"],
			credentials: true,
		},
	});

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
			const session = await authService.findActiveSession(tokenHash);

			if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
				return next(new Error("Authentication session has expired"));
			}

			socket.user = {
				id: payload.sub || payload.id || payload.userId,
				role: payload.role || "player",
				email: payload.email,
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
