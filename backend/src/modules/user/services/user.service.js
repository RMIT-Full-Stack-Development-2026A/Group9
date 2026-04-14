/**
 * ============================================================================
 * USER SERVICE (The Profile & Identity Logic)
 * ============================================================================
 * Purpose: This file contains the core business logic for managing users in 
 * TicTacToang. It acts as the "Brain" for account-related operations, 
 * coordinating between the User Repository and other modules like Leaderboard.
 * * Key Responsibilities:
 * 1. Business Validation: Ensuring usernames aren't offensive or taken.
 * 2. Profile Management: Handling the logic for updating bio, avatars, or settings.
 * 3. XP & Leveling: Logic to check if a user should "Level Up" after a game.
 * 4. Privacy: Filtering sensitive data (like emails) from public profile views.
 * * CRITICAL RULE: The Service layer never touches the 'req' or 'res' objects. 
 * It receives clean data from the Controller and returns Objects or Errors.
 */

// Implementation contract:
// 1) Keep profile/stat rules in this layer, not repository/controller.
// 2) Use DTO-normalized inputs and return sanitized user output objects.
// 3) Coordinate cross-module updates (e.g., leaderboard/profile snapshots) here.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as userRepository from "../repositories/user.repository.js";
import UserProfile from "../models/userProfile.model.js";
import GameSession from "../../game/models/gameSession.model.js";

export const getProfile = async (userId) => {
	const user = await userRepository.findById(userId);
	if (!user) throw new Error("User not found");

	       // Fetch user profile for avatar, country, and premiumUntil
	       const profile = await UserProfile.findById(userId);
	       let avatar = "";
	       let country = "";
	       let premiumUntil = null;
	       if (profile) {
		       avatar = profile.avatar || "";
		       country = profile.country || "";
		       premiumUntil = profile.premiumUntil || null;
	       }

	       // Merge avatar, country, and premiumUntil into user object
	       const userObj = user.toObject ? user.toObject() : { ...user };
	       userObj.avatar = avatar;
	       userObj.country = country;
	       userObj.premiumUntil = premiumUntil;
	       return userObj;
};

export const updateProfile = async (userId, updateData) => {
	const user = await userRepository.findByIdWithPassword(userId);
	if (!user) throw new Error("User not found");

	if (updateData.email && updateData.email !== user.email) {
		const existing = await userRepository.findByEmail(updateData.email);
		if (existing) throw new Error("Email already in use");
		user.email = updateData.email;
	}

	if (updateData.username) user.username = updateData.username;
	if (updateData.country !== undefined) {
		user.country = updateData.country;
		// Update country in UserProfile
		await UserProfile.findByIdAndUpdate(
			userId,
			{ country: updateData.country },
			{ new: true, upsert: true }
		);
	}

	if (updateData.newPassword) {
		if (!updateData.currentPassword) {
			throw new Error("Current password is required");
		}
		const isMatch = await bcrypt.compare(updateData.currentPassword, user.password);
		if (!isMatch) throw new Error("Current password is incorrect");
		user.password = await bcrypt.hash(updateData.newPassword, 10);
	}

	await user.save();

	       // Merge avatar, country, and premiumUntil from UserProfile (same as getProfile)
	       const profile = await UserProfile.findById(userId);
	       let avatar = "";
	       let country = "";
	       let premiumUntil = null;
	       if (profile) {
		       avatar = profile.avatar || "";
		       country = profile.country || "";
		       premiumUntil = profile.premiumUntil || null;
	       }

	       const userData = user.toObject();
	       userData.avatar = avatar;
	       userData.country = country;
	       userData.premiumUntil = premiumUntil;
	       delete userData.password;
	       return userData;
};

export const updateAvatar = async (userId, avatarPath) => {
		// Update avatar in UserProfile
		await UserProfile.findByIdAndUpdate(
			userId,
			{ avatar: avatarPath },
			{ new: true, upsert: true }
		);
		// Return merged profile as in getProfile
		return getProfile(userId);
};

export const getGameHistory = async (userId, query) => {
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

	let sessions = await GameSession.find(filter)
		.populate("players", "username")
		.populate("winner", "username")
		.sort(sort)
		.lean();

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