import * as multiplayerService from '../services/multiplayer.service.js';

// Example: Expose a public function for other modules
export const createRoom = (hostId, options) => {
	return multiplayerService.createRoom(hostId, options);
};
