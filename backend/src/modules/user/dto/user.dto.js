/**
 * ============================================================================
 * USER DTO FILE PURPOSE
 * ============================================================================
 * Purpose: Defines request/response DTO contracts for User module APIs.
 *
 * Teammate guidance:
 * 1) Add DTO builders for user profile/search/update endpoints.
 * 2) Add payload/query validation helpers used by routes/controllers.
 * 3) Keep this file user-only (do not mix Auth/Admin/Leaderboard DTO logic).
 */

export const UserDto = {
	toProfileResponse: (account, profile) => {
		return {
			_id: account._id,
			username: account.username,
			email: account.email,
			role: account.role,
			isActive: account.isActive,
			createdAt: account.createdAt,
			country: profile?.country || "",
			avatar: profile?.avatar || "",
			premiumUntil: profile?.premiumUntil || null,
			walletBalance: profile?.walletBalance || 0,
		};
	},

	toPublicProfileResponse: (account, profile) => {
		return {
			_id: account._id,
			username: account.username,
			role: account.role,
			isActive: account.isActive,
			country: profile?.country || "",
			avatar: profile?.avatar || "",
			// Explicit omission of email and walletBalance (Security Rule A.3.2)
		};
	}

};