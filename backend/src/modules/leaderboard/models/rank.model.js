/**
 * ============================================================================
 * RANK MODEL (The Progression Blueprint)
 * ============================================================================
 * Purpose: While the User model tracks XP and wins, the Rank model defines 
 * the "Tiers" of TicTacToang. It acts as a reference table that maps XP 
 * thresholds to specific titles (e.g., Bronze, Silver, Grandmaster).
 * * Key Responsibilities:
 * 1. Define XP requirements for each level.
 * 2. Store metadata for ranks (e.g., Badge Icons, Rank Names).
 * 3. Provide a structure for "Tier-based" matchmaking (e.g., only Gold vs Gold).
 * * CRITICAL RULE: This model is usually "Static" or "Read-Heavy." You likely 
 * won't create new Ranks via the API often; you'll define them once and 
 * reference them to show users their current "League."
 */

import mongoose from "mongoose";

const rankSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserAccount",
			required: true,
			index: true,
		},
		wins: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
		losses: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
		draws: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
		totalGames: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
		winRate: {
			type: Number,
			required: true,
			min: 0,
			max: 100,
			default: 0,
		},
	},
	{
		timestamps: { createdAt: false, updatedAt: true },
		collection: process.env.MONGO_RANK_COLLECTION || "Ranks",
		toJSON: { virtuals: false },
		toObject: { virtuals: false },
	}
);

rankSchema.pre("validate", function syncDerivedLeaderboardFields(next) {
	this.totalGames = (this.wins || 0) + (this.losses || 0) + (this.draws || 0);
	this.winRate = this.totalGames > 0 ? Number(((this.wins / this.totalGames) * 100).toFixed(1)) : 0;
	next();
});

// One rank per season, plus read-heavy indexes for ranking filters/sorts.
rankSchema.index({ userId: 1 }, { unique: true });

const Rank = mongoose.models.Rank || mongoose.model("Rank", rankSchema);

export default Rank;