/**
 * ============================================================================
 * ADMIN DTO PLACEHOLDER
 * ============================================================================
 * Owner: Admin feature assignee.
 * Purpose: Define Admin request/response DTO contracts in this file.
 *
 * TODO(admin-owner):
 * - Add DTO builders for admin actions.
 * - Add payload/query validators.
 * - Add response mappers for admin APIs.
 */
export const adminDto = {
    
    toPlayerResponse: (user) => {
        // Use premiumUntil from joined profile if available
        const premiumUntil = user.profile?.premiumUntil;
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
            isPremium: premiumUntil ? new Date(premiumUntil) > new Date() : false,
            isActive: user.isActive !== false, 
            isDeactivated: user.isDeactivated || false,
            joinedDate: user.createdAt,
        };
    },

    
    toRoomResponse: (room) => {
        return {
            roomNumber: room._id.toString(), 
            player1: room.player1?.username || "Unknown",
            player2: room.player2?.username || "Waiting...",
            startTime: room.createdAt,
            status: room.status || "In Progress",
        };
    },

    
    toMetricsResponse: (totalPlayers, activeRooms) => {
        return {
            totalPlayers,
            activeRooms,
            serverLoad: `${Math.min(100, Math.round((activeRooms / 100) * 100))}%` 
        };
    }
};