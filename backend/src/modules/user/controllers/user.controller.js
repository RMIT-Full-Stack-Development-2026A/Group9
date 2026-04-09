import * as userService from "../services/user.service.js";

export async function getMyProfile(req, res, next) {
	try {
		const profile = await userService.getProfile(req.user.id);
		res.status(200).json({ success: true, data: profile });
	} catch (err) {
		next(err);
	}
}

export async function updateMyProfile(req, res, next) {
	try {
		const updated = await userService.updateProfile(req.user.id, req.body);
		res.status(200).json({ success: true, data: updated });
	} catch (err) {
		next(err);
	}
}

export async function uploadMyAvatar(req, res, next) {
	try {
		const result = await userService.uploadAvatar(req.user.id, req.file?.buffer);
		res.status(200).json({ success: true, data: result });
	} catch (err) {
		next(err);
	}
}