import User from "../users/user.model.js";
import GameSession from "../game/gameSession.model.js";

export const findAllPlayers = () =>
  User.find({ role: "player" })
    .select("username email isPremium isActive createdAt")
    .sort({ createdAt: -1 })
    .lean();

export const findUserById = (id) => User.findById(id);

export const updateUserStatus = (id, isActive) =>
  User.findByIdAndUpdate(id, { isActive }, { new: true }).select("-password");

export const findAllGameRooms = (filter = {}) =>
  GameSession.find({ gameType: "online", ...filter })
    .populate("players", "username")
    .sort({ startTime: -1 })
    .lean();

export const findGameRoomById = (id) =>
  GameSession.findById(id).populate("players", "username");

export const closeGameRoom = (id) =>
  GameSession.findByIdAndUpdate(
    id,
    { result: "aborted", endTime: new Date() },
    { new: true }
  );
