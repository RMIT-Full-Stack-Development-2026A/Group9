
import AppError from "../../../shared/errors/AppError.js";
import * as authService from "../../auth/services/auth.service.js";
import { adminRepository } from "../repositories/admin.repository.js";
import { adminDto } from "../dto/admin.dto.js";

export const adminService = {
    getMetrics: async () => {
        const [
            totalPlayers,
            activeAccounts,
            inactiveAccounts,
            premiumUsers
        ] = await Promise.all([
            adminRepository.countTotalUsers(),
            adminRepository.countActiveAccounts(),
            adminRepository.countInactiveAccounts(),
            adminRepository.countPremiumUsers()
        ]);
        return adminDto.toMetricsResponse({
            totalPlayers,
            activeAccounts,
            inactiveAccounts,
            premiumUsers
        });
    },

    getPlayers: async () => {
        const users = await adminRepository.findAllUsers();
        return users.map(adminDto.toPlayerResponse);
    },

    togglePlayerStatus: async (adminId, targetUserId) => {
        const user = await adminRepository.findUserById(targetUserId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const newStatus = !user.isActive;
        const updatedUser = await adminRepository.updateUserActiveStatus(targetUserId, newStatus);
        if (newStatus === false) {
            await authService.revokeAllSessionsForUser(targetUserId);
        }
        await adminRepository.createActionLog({
            adminId,
            actionType: newStatus ? "ACTIVATE_USER" : "DEACTIVATE_USER",
            targetUserId,
            metadata: { previousStatus: user.isActive }
        });
        return adminDto.toPlayerResponse(updatedUser);
    }
};