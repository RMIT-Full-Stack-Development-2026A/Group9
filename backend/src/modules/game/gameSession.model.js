import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
  sessionNumber: { type: Number, unique: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  botName: { type: String, default: null },

  gameType: {
    type: String,
    enum: ["single", "local", "online"],
    required: true,
  },
  boardSize: { type: Number, default: 15 },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  result: {
    type: String,
    enum: ["win", "draw", "aborted"],
    required: true,
  },

  startTime: { type: Date, required: true },
  endTime: { type: Date },

  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Move" }],
});

gameSessionSchema.pre("save", async function () {
  if (this.isNew && !this.sessionNumber) {
    const last = await mongoose
      .model("GameSession")
      .findOne()
      .sort({ sessionNumber: -1 });
    this.sessionNumber = last ? last.sessionNumber + 1 : 1;
  }
});

const GameSession = mongoose.model("GameSession", gameSessionSchema);
export default GameSession;