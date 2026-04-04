import GameRoom from "./gameRoom.model.js";

export const createRoom = (data) => GameRoom.create(data);

export const findRoomById = (id) =>
  GameRoom.findById(id).populate("player1 player2", "username avatar");

export const findWaitingRooms = () =>
  GameRoom.find({ status: "waiting" })
    .populate("player1", "username avatar")
    .sort({ startTime: -1 })
    .lean();

export const findActiveRooms = () =>
  GameRoom.find({ status: { $in: ["waiting", "playing"] } })
    .populate("player1 player2", "username avatar")
    .sort({ startTime: -1 })
    .lean();

export const updateRoom = (id, data) =>
  GameRoom.findByIdAndUpdate(id, data, { new: true }).populate("player1 player2", "username avatar");

export const closeRoom = (id) =>
  GameRoom.findByIdAndUpdate(
    id,
    { status: "finished", endTime: new Date() },
    { new: true }
  );
