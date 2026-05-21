import GameRoom from "../models/multiplayer.model.js";

// Create and persist a new multiplayer room document.
export const createRoom = (data) => GameRoom.create(data);

// Find a room by id and populate both player references with user display fields.
export const findRoomById = (id) =>
	GameRoom.findById(id).populate("player1 player2", "username avatar");

// Return only waiting rooms, newest first, with player1 profile info attached.
export const findWaitingRooms = () =>
	GameRoom.find({ status: "waiting" })
		.populate("player1", "username avatar")
		.sort({ createdAt: -1 })
		.lean();

// Return every room that should be considered active in the UI.
export const findActiveRooms = () =>
	GameRoom.find({})
		.populate("player1 player2", "username avatar")
		.sort({ createdAt: -1 })
		.lean();

// Update a room and return the updated document with populated player fields.
export const updateRoom = (id, data) =>
	GameRoom.findByIdAndUpdate(id, data, { returnDocument: "after" }).populate("player1 player2", "username avatar");

// Mark a room as closed and set its terminal time.
export const closeRoom = (id, status = "cancelled", endTime = new Date()) =>
	GameRoom.findByIdAndUpdate(
		id,
		{ status, endTime },
		{ returnDocument: "after" }
	).populate("player1 player2", "username avatar");

// Find the room attached to a completed game session.
export const findRoomBySessionId = (sessionId) =>
	GameRoom.findOne({ sessionId }).populate("player1 player2", "username avatar");

// Claim a waiting room for a second player in a single atomic update.
export const findRoomAndClaim = (roomId, userId) =>
	GameRoom.findOneAndUpdate(
		{ _id: roomId, status: "waiting" },
		{ $set: { player2: userId, status: "playing" } },
		{ returnDocument: "after" }
	);

// Generate the next sequential room number by inspecting the latest room.
export const generateRoomNumber = async () => {
	const lastRoom = await GameRoom.findOne({}).sort({ roomNumber: -1 }).lean();
	return (lastRoom?.roomNumber || 0) + 1;
};
