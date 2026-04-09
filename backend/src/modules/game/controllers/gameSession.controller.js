import * as gameRepo from "../repositories/gameSession.repository.js";

export async function getMyHistory(req, res, next) {
	try {
		const sessions = await gameRepo.findByPlayer(req.user.id, {
			search: req.query.search,
			result: req.query.result,
			gameType: req.query.gameType,
			dateFrom: req.query.dateFrom,
			dateTo: req.query.dateTo,
			sortOrder: req.query.sortOrder,
		});

		// Format each session for the frontend
		const formatted = sessions.map((s) => {
			const playerNames = (s.players || []).map((p) => p.username || "Unknown");
			const otherPlayers = (s.players || []).filter(
				(p) => String(p._id) !== String(req.user.id)
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
				const isWinner = s.winner && String(s.winner._id) === String(req.user.id);
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

		res.status(200).json({ success: true, data: formatted });
	} catch (err) {
		next(err);
	}
}
