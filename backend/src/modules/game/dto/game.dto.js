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
