/**
 * ============================================================================
 * GAME ROOM MODEL (The Virtual Lobby Blueprint)
 * ============================================================================
 * Purpose: While 'GameSession' tracks the board and moves, the 'GameRoom' 
 * tracks the "Container" or "Lobby." In TicTacToang, this model manages 
 * the social and access layers of a match before the first 'X' or 'O' 
 * is even placed.
 * * Key Responsibilities:
 * 1. Metadata: Room names, host information, and creation time.
 * 2. Access Control: Private vs. Public status and invite codes.
 * 3. Capacity: Ensuring only 2 players can enter a standard match.
 * 4. Chat/Social: Linking to a separate collection for in-game messaging.
 * * CRITICAL RULE: This model is about the "Waiting Room." Once both 
 * players are ready, this model links to a 'GameSession' ID where the 
 * actual gameplay logic lives.
 */

import mongoose from "mongoose";

const gameRoomSchema = new mongoose.Schema(
	{
		roomNumber: {
			type: Number,
			required: true,
			unique: true,
			index: true,
		},
		roomCode: {
			type: String,
			required: false,
			trim: true,
			uppercase: true,
		},
		player1: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		player2: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		hostUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
			index: true,
		},
		guestUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		status: {
			type: String,
			enum: ["waiting", "playing", "finished", "cancelled"],
			default: "waiting",
			index: true,
		},
		visibility: {
			type: String,
			enum: ["public", "private"],
			default: "public",
		},
		boardSize: {
			type: Number,
			default: 3,
			min: 3,
			max: 3,
		},
		hostSymbol: {
			type: String,
			enum: ["X", "O"],
			default: "X",
		},
		player1Marker: {
			type: String,
			enum: ["X", "O"],
			default: "X",
		},
		player2Marker: {
			type: String,
			enum: ["X", "O", null],
			default: "O",
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
		startedAt: {
			type: Date,
			default: null,
		},
		endedAt: {
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