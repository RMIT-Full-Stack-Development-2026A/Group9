import { adminService } from "../services/admin.service.js";
import { getIO } from "../../../socket/index.js";

export const getMetrics = async (req, res, next) => {
	try {
		const metrics = await adminService.getMetrics();
		return res.status(200).json({ success: true, data: metrics });
	} catch (error) {
		return next(error);
	}
};

export const getPlayers = async (req, res, next) => {
	try {
		const players = await adminService.getPlayers();
		return res.status(200).json({ success: true, data: players });
	} catch (error) {
		return next(error);
	}
};

export const togglePlayerStatus = async (req, res, next) => {
	try {
		const adminId = req.user.id;
		const targetUserId = req.params.id;
		const updatedPlayer = await adminService.togglePlayerStatus(adminId, targetUserId);
		return res.status(200).json({
			success: true,
			message: `User ${updatedPlayer.isActive ? "activated" : "deactivated"} successfully`,
			data: updatedPlayer,
		});
	} catch (error) {
		return next(error);
	}
};

// ── Room management ───────────────────────────────────────────────

export const getActiveRooms = async (req, res, next) => {
	try {
		const rooms = await adminService.getActiveRooms();
		return res.status(200).json({ success: true, data: rooms });
	} catch (error) {
		return next(error);
	}
};

export const searchRooms = async (req, res, next) => {
	try {
		const { q } = req.query;
		const rooms = await adminService.searchRooms(q);
		return res.status(200).json({ success: true, data: rooms });
	} catch (error) {
		return next(error);
	}
};

export const closeRoom = async (req, res, next) => {
	try {
		const roomId = req.params.id;
		const room = await adminService.closeRoom(roomId);

		// Kick all players out of the room via WebSocket
		const io = getIO();
		if (io) {
			io.to(`room:${roomId}`).emit("room:closed", { roomId });

			// Force all sockets to leave the room
			const roomSockets = io.sockets.adapter.rooms.get(`room:${roomId}`);
			if (roomSockets) {
				for (const socketId of roomSockets) {
					const s = io.sockets.sockets.get(socketId);
					if (s) s.leave(`room:${roomId}`);
				}
			}
		}

		return res.status(200).json({ success: true, message: "Room closed", data: room });
	} catch (error) {
		return next(error);
	}
};
