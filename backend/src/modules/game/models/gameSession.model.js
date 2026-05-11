import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
	{
		sessionNumber: {
			type: Number,
			index: true,
		},
		// Ultimo-strict schema:
		// - player1: registered user who started the session
		// - player2: optional (online matches)
		// - player2Name: display name for local guest or AI bot
		player1: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserAccount",
			required: true,
		},
		player2: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserAccount",
			default: null,
		},
		player2Name: {
			type: String,
			default: "",
			trim: true,
		},
		winner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserAccount",
			default: null,
		},
		winnerMarker: {
			type: String,
			default: null,
			trim: true,
			maxlength: 8,
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
			default: [],
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
		gameType: {
			type: String,
			enum: ["classic", "ai", "multiplayer"],
			default: "classic",
		},
	},
	{
		timestamps: true,
		collection: process.env.MONGO_GAME_SESSION_COLLECTION || "GameSessions",
	}
);

// Prevent duplicate sessions: same player, same opponent, same start time (within 1 second)
gameSessionSchema.index(
	{ player1: 1, player2: 1, player2Name: 1, startTime: 1 },
	{ unique: true, sparse: true }
);

const GameSession =
	mongoose.models.GameSession || mongoose.model("GameSession", gameSessionSchema);

export default GameSession;