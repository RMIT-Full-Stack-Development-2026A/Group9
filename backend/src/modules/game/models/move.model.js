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