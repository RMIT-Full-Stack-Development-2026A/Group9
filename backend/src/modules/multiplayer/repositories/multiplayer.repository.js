import GameRoom from "../models/multiplayer.model.js";

export const createRoom = (data) => GameRoom.create(data);

export const findRoomById = (id) =>
	GameRoom.findById(id).populate("player1 player2", "username avatar");

export const findWaitingRooms = () =>
	GameRoom.find({ status: "waiting" })
		.populate("player1", "username avatar")
		.sort({ createdAt: -1 })
		.lean();

export const findActiveRooms = () =>
	GameRoom.find({})
		.populate("player1 player2", "username avatar")
		.sort({ createdAt: -1 })
		.lean();

export const updateRoom = (id, data) =>
	GameRoom.findByIdAndUpdate(id, data, { returnDocument: "after" }).populate("player1 player2", "username avatar");

export const closeRoom = (id, status = "cancelled", endTime = new Date()) =>
	GameRoom.findByIdAndUpdate(
		id,
		{ status, endTime },
		{ returnDocument: "after" }
	).populate("player1 player2", "username avatar");

export const findRoomBySessionId = (sessionId) =>
	GameRoom.findOne({ sessionId }).populate("player1 player2", "username avatar");

export const findRoomAndClaim = (roomId, userId) =>
	GameRoom.findOneAndUpdate(
		{ _id: roomId, status: "waiting" },
		{ $set: { player2: userId, status: "playing" } },
		{ returnDocument: "after" }
	);

export const generateRoomNumber = async () => {
	const lastRoom = await GameRoom.findOne({}).sort({ roomNumber: -1 }).lean();
	return (lastRoom?.roomNumber || 0) + 1;
};
