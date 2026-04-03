import User from "../users/user.model.js";

export async function findUserByUsernameOrEmail(identifier) {
	const query = {
		$or: [
			{ username: identifier },
			{ email: identifier.toLowerCase() },
		],
	};

	return User.findOne(query);
}

export async function setFailedLoginAttempt(userId, attempts, lastFailedLogin) {
	return User.findByIdAndUpdate(
		userId,
		{
			failedLoginAttempts: attempts,
			lastFailedLogin,
		},
		{ new: true }
	);
}

export async function resetFailedLoginAttempts(userId) {
	return User.findByIdAndUpdate(
		userId,
		{
			failedLoginAttempts: 0,
			lastFailedLogin: null,
		},
		{ new: true }
	);
}
