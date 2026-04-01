import GameSession from "./gameSession.model.js";

export const findSessionsByFilter = (filter, sort) => {
  return GameSession.find(filter)
    .populate("players", "username")
    .populate("winner", "username")
    .sort(sort)
    .lean();
};