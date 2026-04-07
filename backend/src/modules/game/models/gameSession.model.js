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
				ref: "User",
			},
		],
		winner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		result: {
			type: String,
			enum: ["win", "lose", "draw", "aborted"],
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
		status: {
			type: String,
			enum: ["waiting", "active", "finished", "draw"],
			default: "waiting",
		},
		nextPlayer: {
			type: String,
			enum: ["X", "O"],
			default: "X",
		},
		winnerSymbol: {
			type: String,
			enum: ["X", "O", null],
			default: null,
		},
		winningLine: {
			type: [Number],
			default: [],
		},
		endedAt: {
			type: Date,
			default: null,
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