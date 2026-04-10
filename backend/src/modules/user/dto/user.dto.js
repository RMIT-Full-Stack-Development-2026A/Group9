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

	toGameHistoryResponse: (sessions, userId) => {
		return sessions.map((s) => {
			const playerNames = (s.players || []).map((p) => p.username || "Unknown");
			const otherPlayers = (s.players || []).filter(
				(p) => String(p._id) !== String(userId)
			);

			// Determine player2 display name
			let player2Name = "";
			if (s.gameType === "ai" && s.botName) {
				player2Name = s.botName;
			} else if (s.gameType === "classic" && s.localPlayer2Name) {
				player2Name = s.localPlayer2Name;
			} else if (otherPlayers.length > 0) {
				player2Name = otherPlayers[0].username;
			}

			// Determine result relative to the requesting player
			let relativeResult = s.result;
			if (s.result === "player1_win" || s.result === "player2_win") {
				const isWinner = s.winner && String(s.winner._id) === String(userId);
				relativeResult = isWinner ? "win" : "lose";
			}

			// Map gameType to display label
			const gameTypeLabels = {
				ai: "Single Player",
				classic: "Two Players",
				multiplayer: "Online Match",
			};

			return {
				_id: s._id,
				sessionNumber: s.sessionNumber,
				startTime: s.startTime,
				endTime: s.endTime,
				gameType: s.gameType,
				gameTypeLabel: gameTypeLabels[s.gameType] || s.gameType,
				result: relativeResult,
				players: playerNames,
				player2Name,
				winner: s.winner?.username || null,
			};
		});
	}
};