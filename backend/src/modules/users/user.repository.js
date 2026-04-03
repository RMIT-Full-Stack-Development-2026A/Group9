import User from "./user.model.js";

export async function findUserById(userId) {
	return User.findById(userId);
}
