// Normalize authentication response for clients. Keep token together with a
// minimal user object (no passwords or sensitive metadata).
export const createAuthResponseDTO = ({ accessToken, user }) => ({
	accessToken,
	user: {
		id: user.id || user._id,
		username: user.username,
		email: user.email,
		role: user.role,
		premiumUntil: user.premiumUntil || null,
		avatar: user.avatar || "",
	},
});
