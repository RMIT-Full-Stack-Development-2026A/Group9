import * as gameService from '../services/game.service.js';

// Example: Expose a public function for other modules
export const getGameHistoryForUser = (userId, query) => {
	return gameService.getGameHistoryForUser(userId, query);
};
