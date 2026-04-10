/**
 * ============================================================================
 * GAME SERVICE FILE PURPOSE
 * ============================================================================
 * Purpose: This layer contains Game business logic and use-case rules.
 * It should coordinate DTO input, engine decisions, and repository persistence
 * without handling HTTP concerns directly.
 *
 * Teammate guidance:
 * 1) Keep all gameplay rules and flow validation in this layer.
 * 2) Call engine utilities for board logic and repository for data writes.
 * 3) Throw domain/service errors for controllers to translate to HTTP.
 */

import mongoose from "mongoose";
import * as gameRepository from "../repositories/game.repository.js";

export const getGameHistoryForUser = async (userId, query) => {
	const {
		search,
		gameType,
		result,
		startDate,
		endDate,
		sortOrder = "desc",
	} = query;

	const filter = {
		players: new mongoose.Types.ObjectId(userId),
	};

	if (gameType) filter.gameType = gameType;

	if (result === "win") {
		filter.result = "win";
		filter.winner = new mongoose.Types.ObjectId(userId);
	} else if (result === "lose") {
		filter.result = "win";
		filter.winner = { $ne: new mongoose.Types.ObjectId(userId) };
	} else if (result === "draw" || result === "aborted") {
		filter.result = result;
	}

	if (startDate || endDate) {
		filter.startTime = {};
		if (startDate) filter.startTime.$gte = new Date(startDate);
		if (endDate) {
			const end = new Date(endDate);
			end.setHours(23, 59, 59, 999);
			filter.startTime.$lte = end;
		}
	}

	const sort = { startTime: sortOrder === "asc" ? 1 : -1 };

	let sessions = await gameRepository.findSessionsByFilter(filter, sort);

	if (search) {
		const searchLower = search.toLowerCase();
		sessions = sessions.filter((session) => {
			const otherPlayers = session.players.filter(
				(p) => p._id.toString() !== userId
			);
			if (otherPlayers.some((p) => p.username.toLowerCase().includes(searchLower)))
				return true;
			if (session.botName && session.botName.toLowerCase().includes(searchLower))
				return true;
			return false;
		});
	}

	return sessions.map((session) => {
		let userResult;
		if (session.result === "win") {
			userResult =
				session.winner && session.winner._id.toString() === userId
					? "Win"
					: "Lose";
		} else if (session.result === "draw") {
			userResult = "Draw";
		} else {
			userResult = "Aborted";
		}

		const opponent =
			session.gameType === "single"
				? session.botName || "AI Bot"
				: session.gameType === "local"
				? session.localPlayer2Name || "Player 2"
				: session.players
						.filter((p) => p._id.toString() !== userId)
						.map((p) => p.username)
						.join(", ") || "Unknown";

		const gameTypeLabels = {
			single: "Single Player",
			local: "Two Players",
			online: "Online Match",
		};

		return {
			_id: session._id,
			sessionNumber: session.sessionNumber,
			startTime: session.startTime,
			endTime: session.endTime,
			gameType: gameTypeLabels[session.gameType] || session.gameType,
			result: userResult,
			opponent,
			players: session.players.map((p) => p.username),
		};
	});
};