import AppError from "../../../shared/errors/AppError.js";
import { adminRepository } from "../repositories/admin.repository.js";

export const adminService = {
	getMetrics: async () => {
		const [
			totalPlayers,
			activeAccounts,
			inactiveAccounts,
			premiumUsers,
		] = await Promise.all([
			adminRepository.countTotalUsers(),
			adminRepository.countActiveAccounts(),
			adminRepository.countInactiveAccounts(),
			adminRepository.countPremiumUsers(),
		]);
		return { totalPlayers, activeAccounts, inactiveAccounts, premiumUsers };
	},

	getPlayers: async () => {
		return adminRepository.findAllUsers();
	},

	togglePlayerStatus: async (adminId, targetUserId) => {
		const user = await adminRepository.findUserById(targetUserId);
		if (!user) throw new AppError("User not found", 404);
		const newStatus = !user.isActive;
		const updatedUser = await adminRepository.updateUserActiveStatus(targetUserId, newStatus);
		await adminRepository.createActionLog({
			adminId,
			actionType: newStatus ? "ACTIVATE_USER" : "DEACTIVATE_USER",
			targetUserId,
			metadata: { previousStatus: user.isActive },
		});
		return updatedUser;
	},
};
