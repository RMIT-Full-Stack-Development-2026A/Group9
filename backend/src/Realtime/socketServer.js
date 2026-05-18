/**
 * ============================================================================
 * SOCKET SERVER FILE PURPOSE
 * ============================================================================
 * Purpose: Boots Socket.IO and wires module handlers when clients connect.
 * Keep this file as infrastructure glue only; feature-specific events belong
 * in socketHandlers/*.js files.
 */

import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import registerGameSocketHandlers from "./socketHandlers/game.socket.js";
import registerChatSocketHandlers from "./socketHandlers/chat.socket.js";
import * as tokenBlacklistService from "../shared/security/tokenBlacklist.service.js";

export const initSocket = (httpServer) => {
	const io = new Server(httpServer, {
		cors: {
			origin: process.env.SOCKET_CORS_ORIGIN || "*",
			credentials: true,
		},
	});

	/**
	 * Socket authentication middleware
	 * Validates JWT token and attaches user to socket
	 */
	io.use(async (socket, next) => {
		try {
			const token = socket.handshake.auth.token;

			if (!token) {
				return next(new Error("Authentication token required"));
			}

			// Check if token is blacklisted
			if (tokenBlacklistService.isBlacklisted(token)) {
				return next(new Error("Token has been revoked. Please log in again."));
			}

			// Verify JWT
			const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");

			// Attach user info to socket
			socket.userId = decoded.sub; // User ID from JWT subject
			socket.userRole = decoded.role; // User role

			next();
		} catch (err) {
			next(new Error(`Authentication failed: ${err.message}`));
		}
	});

	io.on("connection", (socket) => {
		// Register handlers for authenticated socket
		registerGameSocketHandlers(io, socket);
		registerChatSocketHandlers(io, socket);

		socket.on("disconnect", () => {
			io.emit("system:user-disconnected", { socketId: socket.id });
		});
	});

	return io;
};