import GameSession from "./gameSession.model.js";
import Move from "./move.model.js";

export const findSessionsByFilter = (filter, sort) => {
  return GameSession.find(filter)
    .populate("players", "username avatar")
    .populate("winner", "username")
    .sort(sort)
    .lean();
};

export const createSession = (data) => GameSession.create(data);

export const findSessionById = (id) =>
  GameSession.findById(id)
    .populate("players", "username avatar")
    .populate("winner", "username");

export const updateSession = (id, data) =>
  GameSession.findByIdAndUpdate(id, data, { new: true });

export const createMove = (data) => Move.create(data);

export const findMovesByGameId = (gameId) =>
  Move.find({ gameId }).sort({ moveNumber: 1 }).lean();

export const findAllRooms = (filter = {}) =>
  GameSession.find({ gameType: "online", ...filter })
    .populate("players", "username")
    .populate("winner", "username")
    .sort({ startTime: -1 })
    .lean();