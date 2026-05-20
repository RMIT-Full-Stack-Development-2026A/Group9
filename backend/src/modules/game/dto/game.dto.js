
// DTO for creating a session
export function validateSessionDTO(body, user) {
	console.log("validateSessionDTO called with:", body);
	const { boardSize = 10, gameType = "classic", player2, player2Name = "" } = body;

	const player1 = user?.id;
	if (!player1) throw new Error("player1 required");
	if (![10, 15].includes(boardSize)) throw new Error("Invalid board size");
	if (!["classic", "ai", "multiplayer"].includes(gameType)) throw new Error("Invalid game type");

	// For local + AI, we must have a display name for the second side.
	if (gameType === "classic" || gameType === "ai") {
		if (typeof player2Name !== "string" || player2Name.trim().length === 0) {
			throw new Error("player2Name required");
		}
	}

	return {
		player1,
		player2: player2 || null,
		player2Name: String(player2Name || "").trim(),
		boardSize,
		gameType,
	};
}

// DTO for making a move
export function validateMoveDTO(body) {
	const { sessionId, idx, marker } = body;
	if (!sessionId) throw new Error('sessionId required');
	if (typeof idx !== 'number' || idx < 0) throw new Error('Invalid move index');
	if (!marker) throw new Error('marker required');
	return { sessionId, idx, marker };
}

// DTO for aborting a session
export function validateAbortSessionDTO(body) {
	const { sessionId } = body;
	if (!sessionId) throw new Error('sessionId required');
	return { sessionId };
}

// DTO for requesting an AI move
export function validateAIMoveDTO(body) {
	const { sessionId, lastPlayerMoveIdx, marker, aiLevel } = body;
	if (!sessionId) throw new Error("sessionId required");
	if (lastPlayerMoveIdx != null && (typeof lastPlayerMoveIdx !== "number" || lastPlayerMoveIdx < 0)) {
		throw new Error("Invalid lastPlayerMoveIdx");
	}
	if (!marker) throw new Error("marker required");
	if (aiLevel && !["Easy", "Medium", "Hard"].includes(aiLevel)) throw new Error("Invalid aiLevel");
	return { sessionId, lastPlayerMoveIdx, marker, aiLevel: aiLevel || "Easy" };
}

// ── Response DTOs (presentation only — no business logic) ─────────────

const GAME_TYPE_LABELS = {
	classic: "Two Players",
	ai: "Single Player",
	multiplayer: "Online Match",
};

export const toGameHistoryItem = ({ session, userResult, opponent, players }) => ({
	_id: session._id,
	sessionNumber: session.sessionNumber,
	startTime: session.startTime,
	endTime: session.endTime,
	boardSize: session.boardSize || 10,
	gameType: GAME_TYPE_LABELS[session.gameType] || session.gameType,
	result: userResult,
	opponent,
	players,
});