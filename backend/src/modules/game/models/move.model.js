import mongoose from "mongoose";

const moveSchema = new mongoose.Schema(
	{
		gameId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "GameSession",
			required: true,
			index: true,
		},
		playerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		marker: {
			type: String,
			enum: ["X", "O"],
			default: null,
		},
		playerSymbol: {
			type: String,
			enum: ["X", "O"],
			default: null,
		},
		position: {
			type: String,
			required: true,
			trim: true,
		},
		index: {
			type: Number,
			required: false,
			min: 0,
			max: 8,
		},
		row: {
			type: Number,
			required: false,
			min: 0,
		},
		col: {
			type: Number,
			required: false,
			min: 0,
		},
		moveNumber: {
			type: Number,
			required: true,
			min: 1,
		},
	},
	{
		timestamps: true,
		collection: process.env.MONGO_MOVE_COLLECTION || "Moves",
	}
);

const Move = mongoose.models.Move || mongoose.model("Move", moveSchema);

export default Move;