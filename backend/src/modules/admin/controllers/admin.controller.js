
import { adminService } from "../services/admin.service.js";

// Controller: fetch aggregated metrics and return JSON
export const getMetrics = async (req, res, next) => {
    try {
        const metrics = await adminService.getMetrics();
        return res.status(200).json({ success: true, data: metrics });
    } catch (error) {
        // Pass errors to centralized error handler
        return next(error);
    }
};

// Controller: list player accounts (DTO-mapped)
export const getPlayers = async (req, res, next) => {
    try {
        const players = await adminService.getPlayers();
        return res.status(200).json({ success: true, data: players });
    } catch (error) {
        return next(error);
    }
};

// Controller: toggle a player's active flag. Uses `req.user.id` to
// record which admin performed the action for auditing.
export const togglePlayerStatus = async (req, res, next) => {
    try {
        const adminId = req.user.id; // admin performing the action
        const targetUserId = req.params.id; // target player
        const updatedPlayer = await adminService.togglePlayerStatus(adminId, targetUserId);
        return res.status(200).json({ 
            success: true, 
            message: `User ${updatedPlayer.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedPlayer
        });
    } catch (error) {
        return next(error);
    }
};

