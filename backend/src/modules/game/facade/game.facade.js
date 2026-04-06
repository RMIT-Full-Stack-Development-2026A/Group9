import * as gameService from "../services/game.service.js";

export const createGame = async (payload) => {
	return gameService.createGame(payload);
};

export const makeMove = async (session, payload) => {
	return gameService.makeMove(session, payload);
};