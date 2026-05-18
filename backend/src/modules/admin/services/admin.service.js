/**
 * ============================================================================
 * ADMIN SERVICE (The Brain / Business Logic)
 * ============================================================================
 * Purpose: This file contains the core business rules for the Admin module. 
 * It receives clean data from the Controller, performs calculations, enforces 
 * rules, and asks the Repository layer to fetch or save data to MongoDB.
 * * * CRITICAL RULE: A Service must NEVER know about HTTP. 
 * You will never see 'req', 'res', 'next', or 'status(200)' in this file. 
 * If something goes wrong, the Service simply 'throws' an error, and trusts 
 * the Controller to catch it and format the HTTP response.
 */

// Implementation contract:
// 1) Service methods orchestrate repository calls and policy checks.
// 2) Throw AppError for expected failures; let global middleware format output.
// 3) Keep method names action-oriented (listUsers, banUser, unbanUser, etc.).

import AppError from "../../../shared/errors/AppError.js";
import { adminRepository } from "../repositories/admin.repository.js";
import { adminDto } from "../dto/admin.dto.js";

export const adminService = {
    getMetrics: async () => {
        const [
            totalPlayers,
            activeAccounts,
            inactiveAccounts,
            premiumUsers,
            activeRooms
        ] = await Promise.all([
            adminRepository.countTotalUsers(),
            adminRepository.countActiveAccounts(),
            adminRepository.countInactiveAccounts(),
            adminRepository.countPremiumUsers(),
            adminRepository.countActiveRooms()
        ]);
        return adminDto.toMetricsResponse({
            totalPlayers,
            activeAccounts,
            inactiveAccounts,
            premiumUsers,
            activeRooms
        });
    },

    getPlayers: async () => {
        const users = await adminRepository.findAllUsers();
        return users.map(adminDto.toPlayerResponse);
    },

    getRooms: async () => {
        const rooms = await adminRepository.findAllRooms();
        return rooms.map(adminDto.toRoomResponse);
    },

    togglePlayerStatus: async (adminId, targetUserId) => {
        const user = await adminRepository.findUserById(targetUserId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        // Toggle isActive instead of isDeactivated
        const newStatus = !user.isActive;
        const updatedUser = await adminRepository.updateUserActiveStatus(targetUserId, newStatus);
        await adminRepository.createActionLog({
            adminId,
            actionType: newStatus ? "ACTIVATE_USER" : "DEACTIVATE_USER",
            targetUserId,
            metadata: { previousStatus: user.isActive }
        });
        return adminDto.toPlayerResponse(updatedUser);
    },

    closeRoom: async (adminId, roomId) => {
        const room = await adminRepository.findRoomById(roomId);

        if (!room) {
            throw new AppError("Room not found", 404);
        }
        if (room.status === "cancelled" || room.status === "finished") {
            throw new AppError("Room is already closed", 400);
        }

        const closedRoom = await adminRepository.updateRoomStatus(roomId, "cancelled");

        await adminRepository.createActionLog({
            adminId,
            actionType: "CLOSE_ROOM",
            targetRoomId: roomId,
            metadata: { reason: "Force closed by admin" }
        });

        return closedRoom;
    }
};