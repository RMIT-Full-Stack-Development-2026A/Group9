import mongoose from "mongoose";

const moveSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "GameSession", required: true },
  playerId: { type: String, required: true }, // ObjectId string or "ai"
  marker: { type: String, required: true },
  position: { type: String, required: true }, // algebraic notation e.g. "c2"
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  moveNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Move = mongoose.model("Move", moveSchema);
export default Move;