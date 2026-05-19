import mongoose from "mongoose";

const gameRoomSchema = new mongoose.Schema(
	{
		roomNumber: {
			type: Number,
			required: true,
			unique: true,
			index: true,
		},
		player1: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserAccount",
			required: true,
			index: true,
		},
		player2: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserAccount",
			default: null,
		},
		status: {
			type: String,
			enum: ["waiting", "playing", "finished", "cancelled"],
			default: "waiting",
			index: true,
		},
		boardSize: {
			type: Number,
			default: 10,
			min: 10,
			max: 15,
			validate: {
				validator: (v) => [10, 15].includes(v),
				message: "Invalid board size",
			},
		},
		player1Marker: {
			type: String,
			enum: ["X", "O", "⭐", "🔥", "💎", "🌙"],
			default: "X",
		},
		player2Marker: {
			type: String,
			enum: ["X", "O", "⭐", "🔥", "💎", "🌙"],
			default: null,
		},
		firstPlayer: {
			type: String,
			enum: ["player1", "player2"],
			default: "player1",
		},
		sessionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "GameSession",
			default: null,
		},
		startTime: {
			type: Date,
			default: null,
		},
		endTime: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		collection: process.env.MONGO_GAME_ROOM_COLLECTION || "GameRooms",
	}
);

gameRoomSchema.index({ createdAt: -1 });

const GameRoom = mongoose.models.GameRoom || mongoose.model("GameRoom", gameRoomSchema);

export default GameRoom;
