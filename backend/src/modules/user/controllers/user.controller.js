import * as userService from "../services/user.service.js";
import { UserDto } from "../dto/user.dto.js";

export async function getMyProfile(req, res, next) {
	try {
		const { account, profile } = await userService.getProfile(req.user.id);
		res.status(200).json({ success: true, data: UserDto.toProfileResponse(account, profile) });
	} catch (err) {
		next(err);
	}
}

export async function updateMyProfile(req, res, next) {
	try {
		const { account, profile } = await userService.updateProfile(req.user.id, req.body);
		res.status(200).json({ success: true, data: UserDto.toProfileResponse(account, profile) });
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

export async function getGameHistory(req, res, next) {
	try {
		const sessions = await userService.getGameHistory(req.user.id, req.query);
		res.status(200).json({ success: true, data: sessions });
	} catch (err) {
		next(err);
	}
}

export async function getUserProfile(req, res, next) {
	try {
		const { account, profile } = await userService.getProfile(req.params.userId);
		res.status(200).json({ success: true, data: UserDto.toPublicProfileResponse(account, profile) });
	} catch (err) {
		next(err);
	}
}

export async function getUserGameHistory(req, res, next) {
	try {
		const sessions = await userService.getGameHistory(req.params.userId, req.query);
		res.status(200).json({ success: true, data: sessions });
	} catch (err) {
		next(err);
	}
}