import mongoose from "mongoose";

const rankSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAccount", required: true, unique: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const Rank = mongoose.model("Rank", rankSchema);
export default Rank;