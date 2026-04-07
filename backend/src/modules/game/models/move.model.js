import mongoose from "mongoose";

const moveSchema = new mongoose.Schema(
	{
		sessionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "GameSession",
			required: true,
			index: true,
		},
		playerId: {
			type: String,
			enum: ["player1", "player2", "ai"],
			required: true,
			index: true,
		},
		marker: {
			type: String,
			enum: ["X", "O"],
			required: true,
		},
		position: {
			type: String,
			required: true,
			trim: true,
		},
		row: {
			type: Number,
			required: true,
			min: 0,
		},
		col: {
			type: Number,
			required: true,
			min: 0,
		},
		moveNumber: {
			type: Number,
			required: true,
			min: 1,
		},
	},
	{
		timestamps: { createdAt: true, updatedAt: false },
		collection: process.env.MONGO_MOVE_COLLECTION || "Moves",
	}
);

const Move = mongoose.models.Move || mongoose.model("Move", moveSchema);

export default Move;