import * as leaderboardService from '../services/leaderboard.service.js';

// Example: Expose a public function for other modules
export const getLeaderboard = (type, options) => {
	return leaderboardService.getLeaderboard(type, options);
};
