import * as gameService from "./game.service.js";

export const createSession = async (req, res) => {
  try {
    const session = await gameService.createGameSession({
      userId: req.userId,
      ...req.body,
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const endSession = async (req, res) => {
  try {
    const session = await gameService.endGameSession(req.params.id, req.body);
    res.json(session);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const recordMove = async (req, res) => {
  try {
    const move = await gameService.recordMove(req.body);
    res.status(201).json(move);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGameMoves = async (req, res) => {
  try {
    const moves = await gameService.getGameMoves(req.params.id);
    res.json(moves);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getSession = async (req, res) => {
  try {
    const session = await gameService.getGameSession(req.params.id);
    res.json(session);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getAIMove = async (req, res) => {
  try {
    const { board, aiMarker, playerMarker, difficulty, lastMove } = req.body;
    const move = gameService.getAIMove(board, aiMarker, playerMarker, difficulty, lastMove);
    res.json(move);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};