
import { adminService } from "../services/admin.service.js";

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
            message: `User ${updatedPlayer.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedPlayer
        });
    } catch (error) {
        return next(error);
    }
};

