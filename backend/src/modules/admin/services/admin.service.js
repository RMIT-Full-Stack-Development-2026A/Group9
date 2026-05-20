import AppError from "../../../shared/errors/AppError.js";
import { adminRepository } from "../repositories/admin.repository.js";
import * as multiplayerInterface from "../../multiplayer/interface/multiplayer.interface.js";

export const adminService = {
	getMetrics: async () => {
		const [totalPlayers, activeAccounts, inactiveAccounts, premiumUsers] =
			await Promise.all([
				adminRepository.countTotalUsers(),
				adminRepository.countActiveAccounts(),
				adminRepository.countInactiveAccounts(),
				adminRepository.countPremiumUsers(),
			]);
		return { totalPlayers, activeAccounts, inactiveAccounts, premiumUsers };
	},

	getPlayers: async () => adminRepository.findAllUsers(),

	togglePlayerStatus: async (adminId, targetUserId) => {
		const user = await adminRepository.findUserById(targetUserId);
		if (!user) throw new AppError("User not found", 404);
		const newStatus = !user.isActive;
		const updatedUser = await adminRepository.updateUserActiveStatus(
			targetUserId, newStatus
		);
		await adminRepository.createActionLog({
			adminId,
			actionType: newStatus ? "ACTIVATE_USER" : "DEACTIVATE_USER",
			targetUserId,
			metadata: { previousStatus: user.isActive },
		});
		return updatedUser;
	},

	// ── Room management ───────────────────────────────────────────

	getActiveRooms: async () => multiplayerInterface.getActiveRooms(),

	searchRooms: async (query) => {
		const rooms = await multiplayerInterface.getActiveRooms();
		if (!query) return rooms;
		const q = String(query).toLowerCase();
		return rooms.filter(
			(r) =>
				String(r.roomNumber).includes(q) ||
				r.player1?.username?.toLowerCase().includes(q) ||
				r.player2?.username?.toLowerCase().includes(q)
		);
	},

	closeRoom: async (roomId) => {
		const room = await multiplayerInterface.getRoom(roomId);
		if (!room) throw new AppError("Room not found", 404);
		return multiplayerInterface.closeRoom(roomId);
	},
};
