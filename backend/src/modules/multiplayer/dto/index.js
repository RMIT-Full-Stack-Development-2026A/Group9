/**
 * ============================================================================
 * MULTIPLAYER DTOS (Data Transfer Object)
 * ============================================================================
 * Purpose: Validation for multiplayer room creation and joining
 */

/**
 * Validate create room DTO
 * @param {object} data - { boardSize, player1Marker }
 * @returns {object} { valid, errors }
 */
export function validateCreateRoomDTO(data = {}) {
	const errors = [];

	// Validate boardSize
	const validBoardSizes = [10, 15];
	if (data.boardSize === undefined || data.boardSize === null) {
		errors.push('boardSize is required');
	} else if (!validBoardSizes.includes(data.boardSize)) {
		errors.push(`boardSize must be one of: ${validBoardSizes.join(', ')}`);
	}

	// Validate player1Marker
	const validMarkers = ['X', 'O'];
	if (data.player1Marker === undefined || data.player1Marker === null) {
		errors.push('player1Marker is required');
	} else if (!validMarkers.includes(data.player1Marker)) {
		errors.push(`player1Marker must be one of: ${validMarkers.join(', ')}`);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validate join room DTO
 * @param {object} data - { roomId }
 * @returns {object} { valid, errors }
 */
export function validateJoinRoomDTO(data = {}) {
	const errors = [];

	if (!data.roomId) {
		errors.push('roomId is required');
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
