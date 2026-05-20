export const createProfileDTO = (user = {}) => ({
	id: user.id || user._id,
	username: user.username,
	email: user.email?.toLowerCase(),
	country: user.country,
	role: user.role,
	premiumUntil: user.premiumUntil || null,
	avatar: user.avatar || "",
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});

export const createUserResponseDTO = (user = {}) => ({
	id: user.id || user._id,
	username: user.username,
	email: user.email,
	country: user.country,
	role: user.role,
	premiumUntil: user.premiumUntil || null,
	avatar: user.avatar || "",
});
