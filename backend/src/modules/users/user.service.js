import { findUserById } from "./user.repository.js";

function toUserContextDto(user) {
	const isPremium = Boolean(user.premiumUntil && new Date(user.premiumUntil).getTime() > Date.now());

	return {
		username: user.username,
		avatar: user.avatar,
		isPremium,
		role: user.role,
	};
}

export async function getCurrentUserContext(userId) {
	const user = await findUserById(userId);
	if (!user) {
		return {
			ok: false,
			status: 404,
			message: "User not found",
		};
	}

	return {
		ok: true,
		status: 200,
		data: toUserContextDto(user),
	};
}
