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
			ref: "User",
			required: true,
			index: true,
		},
		season: {
			type: String,
			default: "global",
			trim: true,
			index: true,
		},
		rank: {
			type: Number,
			required: true,
			min: 1,
			index: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 0,
			default: 1000,
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
		tier: {
			type: String,
			enum: [
				"Bronze",
				"Silver",
				"Gold",
				"Platinum",
				"Diamond",
				"Expert",
				"Master",
				"Grandmaster",
			],
			default: "Bronze",
			index: true,
		},
		isPremium: {
			type: Boolean,
			default: false,
			index: true,
		},
		rankChangeWeek: {
			type: Number,
			default: 0,
		},
		badgeCode: {
			type: String,
			default: "",
			trim: true,
		},
		lastMatchAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		collection: process.env.MONGO_RANK_COLLECTION || "Ranks",
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Derived UI value used by popup cards; no need to store this in DB.
rankSchema.virtual("matchesPlayed").get(function getMatchesPlayed() {
	return (this.wins || 0) + (this.losses || 0);
});

// Derived percentage shown in table and summary cards.
rankSchema.virtual("winRate").get(function getWinRate() {
	const total = (this.wins || 0) + (this.losses || 0);
	if (total === 0) {
		return 0;
	}

	return Number((((this.wins || 0) / total) * 100).toFixed(1));
});

// One rank per season, plus read-heavy indexes for ranking filters/sorts.
rankSchema.index({ season: 1, rank: 1 }, { unique: true });
rankSchema.index({ season: 1, rating: -1 });
rankSchema.index({ season: 1, isPremium: 1, rank: 1 });
rankSchema.index({ userId: 1, season: 1 }, { unique: true });

const Rank = mongoose.models.Rank || mongoose.model("Rank", rankSchema);

export default Rank;