import {
	assertRequiredFields,
	isBoardIndex,
	sanitizeString,
} from "../../shared/utils/validators.js";

const ALLOWED_GAME_TYPES = ["classic", "ai", "multiplayer"];
const ALLOWED_AI_LEVELS = ["easy", "medium", "hard"];

export const createGameDTO = ({ boardSize = 3, gameType = "classic", aiLevel = "easy" } = {}) => ({
	boardSize: Number(boardSize),
	gameType: sanitizeString(gameType),
	aiLevel: sanitizeString(aiLevel),
});

export const createMoveDTO = ({ gameId, index, player } = {}) => ({
	gameId: sanitizeString(gameId),
	index: Number(index),
	player: sanitizeString(player),
});

export const validateCreateGamePayload = (payload = {}) => {
	const value = createGameDTO(payload);
	const errors = [];

	if (value.boardSize !== 3) {
		errors.push("Currently only 3x3 board is supported");
	}

	if (!ALLOWED_GAME_TYPES.includes(value.gameType)) {
		errors.push(`gameType must be one of: ${ALLOWED_GAME_TYPES.join(", ")}`);
	}

	if (value.gameType === "ai" && !ALLOWED_AI_LEVELS.includes(value.aiLevel)) {
		errors.push(`aiLevel must be one of: ${ALLOWED_AI_LEVELS.join(", ")}`);
	}

	return {
		valid: errors.length === 0,
		errors,
		value,
	};
};

export const validateMovePayload = (payload = {}, boardSize = 3) => {
	const value = createMoveDTO(payload);
	const errors = [];

	const requiredCheck = assertRequiredFields(value, ["index", "player"]);
	if (!requiredCheck.valid) {
		errors.push(`Missing required fields: ${requiredCheck.missing.join(", ")}`);
	}

	if (!isBoardIndex(value.index, boardSize)) {
		errors.push("Move index is outside board range");
	}

	if (!["X", "O"].includes(value.player)) {
		errors.push("player must be X or O");
	}

	return {
		valid: errors.length === 0,
		errors,
		value,
	};
};