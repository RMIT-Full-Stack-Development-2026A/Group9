/**
 * ============================================================================
 * CHAT SOCKET HANDLER PURPOSE
 * ============================================================================
 * Purpose: Registers realtime chat events for room participation and message
 * broadcast behavior.
 * Current logic is a lightweight starter and can be expanded by the assignee.
 */
import { checkPremiumStatus } from "../../middlewares/auth.middleware.js";

export default function registerChatSocketHandlers(io, socket) {
    socket.on("chat:join", ({ roomId } = {}) => {
        if (!roomId) {
            return;
        }

        socket.join(roomId);
    });

	socket.on("chat:send", async ({ roomId, message } = {}) => {
		if (!roomId || !message) {
			return;
		}

		const { hasPremium } = await checkPremiumStatus(socket.user.id);

		if (!hasPremium) {
            socket.emit("chat:error", { message: "Chat is a Premium-only feature." });
            return;
        }

        io.to(roomId).emit("chat:message", {
            senderId: socket.user.id,
            message: String(message).trim(),
            timestamp: new Date().toISOString(),
        });
    });

    socket.on("chat:leave", ({ roomId } = {}) => {
        if (!roomId) {
            return;
        }

        socket.leave(roomId);
    });
}