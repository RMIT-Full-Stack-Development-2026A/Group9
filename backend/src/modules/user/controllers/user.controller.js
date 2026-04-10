import * as userService from "../services/user.service.js";
import { UserDto } from "../dto/user.dto.js";
import { getGameHistoryForUser } from "../../game/interface/game.interface.js";

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

export async function getMyHistory(req, res, next) {
	try {
		const sessions = await getGameHistoryForUser(req.user.id, {
			search: req.query.search,
			result: req.query.result,
			gameType: req.query.gameType,
			startDate: req.query.dateFrom, // Map frontend 'dateFrom' to service 'startDate'
			endDate: req.query.dateTo,     // Map frontend 'dateTo' to service 'endDate'
			sortOrder: req.query.sortOrder,
		});

		res.status(200).json({ success: true, data: sessions });
	} catch (err) {
		next(err);
	}
}