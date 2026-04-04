import mongoose from "mongoose";
import * as gameRepository from "./game.repository.js";
import { createBoard, checkWin, isBoardFull, isValidMove, toAlgebraic } from "./engine/gameEngine.js";
import { getEasyMove } from "./ai/easyAI.js";
import { getMediumMove } from "./ai/mediumAI.js";
import { getHardMove } from "./ai/hardAI.js";
import { AI_NAMES } from "../../shared/constants/gameTypes.js";
import { AppError } from "../../shared/errors/AppError.js";

/**
 * Create a new game session (Req 4.1.1, 4.2.2)
 */
export const createGameSession = async ({ userId, gameType, boardSize = 10, difficulty, player2Name, firstPlayer = "player1" }) => {
  const sessionData = {
    players: [userId],
    gameType,
    boardSize,
    startTime: new Date(),
    result: "aborted", // default until game ends properly
  };

  if (gameType === "single") {
    sessionData.botName = AI_NAMES[difficulty] || AI_NAMES.easy;
  }

  if (gameType === "local") {
    sessionData.localPlayer2Name = player2Name || "Player 2";
  }

  const session = await gameRepository.createSession(sessionData);
  return session;
};

/**
 * Record a move (Req 4.3.3 — for replay support)
 */
export const recordMove = async ({ gameId, playerId, marker, row, col, moveNumber, boardSize }) => {
  const position = toAlgebraic(row, col, boardSize);
  return gameRepository.createMove({
    gameId,
    playerId,
    marker,
    position,
    row,
    col,
    moveNumber,
  });
};

/**
 * End a game session
 */
export const endGameSession = async (sessionId, { winnerId, result }) => {
  const update = {
    endTime: new Date(),
    result,
  };
  if (winnerId) {
    update.winner = winnerId;
  }
  return gameRepository.updateSession(sessionId, update);
};

/**
 * Get AI move based on difficulty (Req 4.2.3, 4.2.4, 4.2.5)
 */
export const getAIMove = (board, aiMarker, playerMarker, difficulty, lastMove) => {
  switch (difficulty) {
    case "easy":
      return getEasyMove(board, lastMove);
    case "medium":
      return getMediumMove(board, aiMarker, playerMarker, lastMove);
    case "hard":
      return getHardMove(board, aiMarker, playerMarker, lastMove);
    default:
      return getEasyMove(board, lastMove);
  }
};

/**
 * Get moves for replay (Req 4.3.3)
 */
export const getGameMoves = async (sessionId) => {
  return gameRepository.findMovesByGameId(sessionId);
};

/**
 * Get game session details
 */
export const getGameSession = async (sessionId) => {
  const session = await gameRepository.findSessionById(sessionId);
  if (!session) throw new AppError("Game session not found", 404);
  return session;
};

/**
 * Get game history for a user (existing functionality)
 */
export const getGameHistoryForUser = async (userId, query) => {
  const {
    search,
    gameType,
    result,
    startDate,
    endDate,
    sortOrder = "desc",
  } = query;

  const filter = {
    players: new mongoose.Types.ObjectId(userId),
  };

  if (gameType) filter.gameType = gameType;

  if (result === "win") {
    filter.result = "win";
    filter.winner = new mongoose.Types.ObjectId(userId);
  } else if (result === "lose") {
    filter.result = "win";
    filter.winner = { $ne: new mongoose.Types.ObjectId(userId) };
  } else if (result === "draw" || result === "aborted") {
    filter.result = result;
  }

  if (startDate || endDate) {
    filter.startTime = {};
    if (startDate) filter.startTime.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.startTime.$lte = end;
    }
  }

  const sort = { startTime: sortOrder === "asc" ? 1 : -1 };

  let sessions = await gameRepository.findSessionsByFilter(filter, sort);

  if (search) {
    const searchLower = search.toLowerCase();
    sessions = sessions.filter((session) => {
      const otherPlayers = session.players.filter(
        (p) => p._id.toString() !== userId
      );
      if (otherPlayers.some((p) => p.username.toLowerCase().includes(searchLower)))
        return true;
      if (session.botName && session.botName.toLowerCase().includes(searchLower))
        return true;
      return false;
    });
  }

  return sessions.map((session) => {
    let userResult;
    if (session.result === "win") {
      userResult =
        session.winner && session.winner._id.toString() === userId
          ? "Win"
          : "Lose";
    } else if (session.result === "draw") {
      userResult = "Draw";
    } else {
      userResult = "Aborted";
    }

    const opponent =
      session.gameType === "single"
        ? session.botName || "AI Bot"
        : session.gameType === "local"
        ? session.localPlayer2Name || "Player 2"
        : session.players
            .filter((p) => p._id.toString() !== userId)
            .map((p) => p.username)
            .join(", ") || "Unknown";

    const gameTypeLabels = {
      single: "Single Player",
      local: "Two Players",
      online: "Online Match",
    };

    return {
      _id: session._id,
      sessionNumber: session.sessionNumber,
      startTime: session.startTime,
      endTime: session.endTime,
      gameType: gameTypeLabels[session.gameType] || session.gameType,
      result: userResult,
      opponent,
      players: session.players.map((p) => p.username),
    };
  });
};