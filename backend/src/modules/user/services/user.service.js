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
	const userObjectId = new mongoose.Types.ObjectId(userId);
	const {
		search,
		gameType,
		result,
		startDate,
		endDate,
		sortOrder = "desc",
	} = query;

	const filter = {
		$or: [
			{ player1: userObjectId },
			{ player2: userObjectId },
		],
	};

	if (gameType) {
		const normalizedGameType = {
			single: "ai",
			local: "classic",
			online: "multiplayer",
		}[gameType] || gameType;
		filter.gameType = normalizedGameType;
	}

	if (result === "win") {
		filter.$or = [
			{ player1: userObjectId, result: "player1_win" },
			{ player2: userObjectId, result: "player2_win" },
		];
	} else if (result === "lose") {
		filter.$or = [
			{ player1: userObjectId, result: "player2_win" },
			{ player2: userObjectId, result: "player1_win" },
		];
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
		.populate("player1", "username")
		.populate("player2", "username")
		.populate("winner", "username")
		.sort(sort)
		.lean();

	if (search) {
		const searchLower = search.toLowerCase();
		sessions = sessions.filter((session) => {
			// New schema: check player1 and player2
			let otherPlayers = [];
			if (session.player1 && String(session.player1?._id || session.player1) !== userId) {
				otherPlayers.push(session.player1);
			}
			if (session.player2 && String(session.player2?._id || session.player2) !== userId) {
				otherPlayers.push(session.player2);
			}
			
			if (otherPlayers.some((p) => p.username?.toLowerCase().includes(searchLower)))
				return true;
			if (session.botName && session.botName.toLowerCase().includes(searchLower))
				return true;
			if (session.player2Name && session.player2Name.toLowerCase().includes(searchLower))
				return true;
			return false;
		});
	}

	return sessions.map((session) => {
		let userResult;
		
		// Handle new schema (player1_win/player2_win/draw/aborted)
		if (session.result === "player1_win") {
			userResult = String(session.player1?._id || session.player1 || "") === userId ? "Win" : "Lose";
		} else if (session.result === "player2_win") {
			userResult = String(session.player2?._id || session.player2 || "") === userId ? "Win" : "Lose";
		} else if (session.result === "draw") {
			userResult = "Draw";
		} else if (session.result === "aborted") {
			userResult = "Aborted";
		} else {
			userResult = "Aborted"; // Default fallback
		}

		// Determine opponent: new schema (player1/player2)
		let opponent = "Unknown";
		if (session.gameType === "ai" || session.gameType === "single") {
			opponent = session.player2Name || session.botName || "AI Bot";
		} else {
			// Multiplayer: use player1 and player2
			const userId_str = String(session.player1?._id || session.player1 || "");
			if (userId_str === userId) {
				opponent = session.player2?.username || session.player2Name || "Unknown";
			} else {
				opponent = session.player1?.username || "Unknown";
			}
		}

		const gameTypeLabels = {
			classic: "Two Players",
			ai: "Single Player",
			multiplayer: "Online Match",
		};

		return {
			_id: session._id,
			sessionNumber: session.sessionNumber,
			startTime: session.startTime,
			endTime: session.endTime,
			gameType: gameTypeLabels[session.gameType] || session.gameType,
			result: userResult,
			opponent,
		};
	});
};