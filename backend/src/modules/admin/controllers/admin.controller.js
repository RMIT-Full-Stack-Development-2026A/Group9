import { adminService } from "../services/admin.service.js";
import { adminDto } from "../dto/admin.dto.js";

const playerResponse = (user) => ({
	id: (user._id && typeof user._id.toString === 'function')
		? user._id.toString() : String(user._id),
	username: user.username,
	email: user.email,
	role: user.role,
	isPremium: user.profile?.premiumUntil
		? new Date(user.profile.premiumUntil) > new Date() : false,
	isActive: user.isActive !== false,
	joinedDate: user.createdAt,
});

export const getMetrics = async (req, res, next) => {
	try {
		const metrics = await adminService.getMetrics();
		return res.status(200).json({ success: true, data: adminDto.toMetricsResponse(metrics) });
	} catch (error) {
		return next(error);
	}
};

export const getPlayers = async (req, res, next) => {
	try {
		const players = await adminService.getPlayers();
		return res.status(200).json({
			success: true,
			data: players.map(playerResponse),
		});
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
			data: playerResponse(updatedPlayer),
		});
	} catch (error) {
		return next(error);
	}
};
