import * as gameService from '../services/game.service.js';

export const GameInterface = {
	createSession: gameService.createSession,
	getSessionById: gameService.getSessionById,
	applyMove: gameService.applyMove,
	toAlgebraicNotation: gameService.toAlgebraicNotation,
	appendMove: gameService.appendMove,
	abortSession: gameService.abortSession,
	getMovesBySessionId: gameService.getMovesBySessionId,
};

// ── Cross-module operations (DTO-formatted) ─────────────────────────────

export const getGameHistory = async (userId, query) => {
	const sessions = await gameService.getGameHistory(userId, query);

	return sessions.map((session) => {
		let userResult;

		if (session.result === "player1_win") {
			userResult = String(session.player1?._id || session.player1 || "") === userId ? "Win" : "Lose";
		} else if (session.result === "player2_win") {
			userResult = String(session.player2?._id || session.player2 || "") === userId ? "Win" : "Lose";
		} else if (session.result === "draw") {
			userResult = "Draw";
		} else {
			userResult = "Aborted";
		}

		let opponent = "Unknown";
		let players = [];
		if (session.gameType === "ai" || session.gameType === "single") {
			opponent = session.player2Name || session.botName || "AI Bot";
			players = [
				{ role: "player1", name: session.player1?.username || "Unknown" },
				{ role: "opponent", name: session.player2Name || session.botName || "AI Bot" },
			];
		} else {
			const userIdStr = String(session.player1?._id || session.player1 || "");
			if (userIdStr === userId) {
				opponent = session.player2?.username || session.player2Name || "Unknown";
			} else {
				opponent = session.player1?.username || "Unknown";
			}
			players = [
				{ role: "player1", name: session.player1?.username || "Unknown" },
				{ role: "player2", name: session.player2?.username || session.player2Name || "Unknown" },
			];
		}

		const gameTypeLabels = {
			classic: "Two Players",
			ai: "Single Player",
			multiplayer: "Online Match",
		};

		return {
			_id: session._id,
			sessionNumber: session.sessionNumber,
			startTime: session.startTime,
			endTime: session.endTime,
			boardSize: session.boardSize || 10,
			gameType: gameTypeLabels[session.gameType] || session.gameType,
			result: userResult,
			opponent,
			players,
		};
	});
};
