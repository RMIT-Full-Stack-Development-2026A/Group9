import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
	{
		sessionNumber: {
			type: Number,
			index: true,
		},
		players: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "UserAccount",
			},
		],
		winner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserAccount",
			default: null,
		},
		result: {
			type: String,
			enum: ["player1_win", "player2_win", "draw", "aborted"],
			default: null,
		},
		startTime: {
			type: Date,
			default: Date.now,
		},
		endTime: {
			type: Date,
			default: null,
		},
		board: {
			type: [String],
			default: Array(9).fill(null),
		},
		boardSize: {
			type: Number,
			default: 3,
			min: 3,
			max: 3,
		},
		gameType: {
			type: String,
			enum: ["classic", "ai", "multiplayer"],
			default: "classic",
		},
		botName: {
			type: String,
			default: "",
			trim: true,
		},
		localPlayer2Name: {
			type: String,
			default: "",
			trim: true,
		},
	},
	{
		timestamps: true,
		collection: process.env.MONGO_GAME_SESSION_COLLECTION || "GameSessions",
	}
);

const GameSession =
	mongoose.models.GameSession || mongoose.model("GameSession", gameSessionSchema);

export default GameSession;