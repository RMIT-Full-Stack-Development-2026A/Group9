import mongoose from "mongoose";

const gameRoomSchema = new mongoose.Schema({
  roomNumber: { type: Number, unique: true },
  player1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["waiting", "playing", "finished"], default: "waiting" },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "GameSession", default: null },
  boardSize: { type: Number, default: 10 },
  player1Marker: { type: String, default: "X" },
  player2Marker: { type: String, default: null },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: null },
});

gameRoomSchema.pre("save", async function () {
  if (this.isNew && !this.roomNumber) {
    const last = await mongoose.model("GameRoom").findOne().sort({ roomNumber: -1 });
    this.roomNumber = last ? last.roomNumber + 1 : 1;
  }
});

const GameRoom = mongoose.model("GameRoom", gameRoomSchema);
export default GameRoom;