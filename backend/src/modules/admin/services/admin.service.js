
import AppError from "../../../shared/errors/AppError.js";
import * as authInterface from "../../auth/interface/auth.interface.js";
import { adminRepository } from "../repositories/admin.repository.js";
import { adminDto } from "../dto/admin.dto.js";

export const adminService = {
    // Aggregate key metrics in parallel for efficiency
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
        return {
            totalPlayers,
            activeAccounts,
            inactiveAccounts,
            premiumUsers
        };
    },

    // Return all users mapped through DTO for a consistent response shape
    getPlayers: async () => {
        const users = await adminRepository.findAllUsers();
        return users.map((user) => adminDto.toPlayerResponse(user));
    },

    // Toggle a player's active flag and perform side-effects:
    // - revoke sessions when deactivating
    // - write an audit log for the action
    togglePlayerStatus: async (adminId, targetUserId) => {
        const user = await adminRepository.findUserById(targetUserId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const newStatus = !user.isActive;

        // Update DB and return the enriched user DTO
        const updatedUser = await adminRepository.updateUserActiveStatus(targetUserId, newStatus);

        // If deactivated, revoke all server-side sessions for safety
        if (newStatus === false) {
            await authInterface.revokeAllSessionsForUser(targetUserId);
        }

        // Persist an admin action log for auditing and compliance
        await adminRepository.createActionLog({
            adminId,
            actionType: newStatus ? "ACTIVATE_USER" : "DEACTIVATE_USER",
            targetUserId,
            metadata: { previousStatus: user.isActive }
        });
        return updatedUser;
    }
};