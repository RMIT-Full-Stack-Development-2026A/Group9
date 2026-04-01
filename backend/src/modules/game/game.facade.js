import * as gameService from "./game.service.js";

export const getGameHistoryForUser = (userId, query) => {
  return gameService.getGameHistoryForUser(userId, query);
};
