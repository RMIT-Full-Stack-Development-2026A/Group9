/**
 * ============================================================================
 * SOCKET SERVER FILE PURPOSE
 * ============================================================================
 * Purpose: Boots Socket.IO and wires module handlers when clients connect.
 * Keep this file as infrastructure glue only; feature-specific events belong
 * in socketHandlers/*.js files.
 */

import { Server } from "socket.io";
import registerGameSocketHandlers from "./socketHandlers/game.socket.js";
import registerChatSocketHandlers from "./socketHandlers/chat.socket.js";
import jwt from "jsonwebtoken";

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, { /* cors config */ });

    // Global Middleware: Authenticate user via JWT
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error"));

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");
            socket.user = {
                id: payload.sub || payload.id,
                role: payload.role || "player",
                // Check actual DB premium status inside handlers for real-time accuracy
            };
            next();
        } catch (err) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        registerGameSocketHandlers(io, socket);
        registerChatSocketHandlers(io, socket);
    });

    return io;
};