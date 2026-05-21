// Shape the public profile response shown to the user.
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

// Shape the public user response returned after auth/profile mutations.
export const createUserResponseDTO = (user = {}) => ({
	id: user.id || user._id,
	username: user.username,
	email: user.email,
	country: user.country,
	role: user.role,
	premiumUntil: user.premiumUntil || null,
	avatar: user.avatar || "",
});
