/**
 * ============================================================================
 * USER CONTROLLER (The Profile & Account Receptionist)
 * ============================================================================
 * Purpose: This file manages HTTP requests related to user accounts, 
 * profiles, and authentication state in TicTacToang. It acts as the 
 * bridge between the Client (Frontend) and the User Service.
 * * Key Responsibilities:
 * 1. Profile Retrieval: GET requests for a user's own data or public profiles.
 * 2. Account Updates: PATCH requests to change usernames or settings.
 * 3. Stats Integration: Displaying a summary of wins/losses/XP.
 * * CRITICAL RULE: The Controller should never talk to the Database 
 * directly. It extracts the User ID from the JWT (Request) and hands 
 * it to the Service.
 */

// Implementation contract:
// 1) Keep all handlers auth-aware and pass req.user.id into service methods.
// 2) Use user DTO contracts for search/update payload normalization.
// 3) Keep output shape consistent for profile pages and admin views.

import * as userService from "../services/user.service.js";

export const getProfile = async (req, res) => {
	try {
		const user = await userService.getProfile(req.user.id);
		res.json(user);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const user = await userService.updateProfile(req.user.id, req.body);
		res.json(user);
	} catch (error) {
		const messages = {
			"Email already in use": 409,
			"Current password is required": 400,
			"Current password is incorrect": 400,
			"User not found": 404,
		};
		const status = messages[error.message] || 500;
		res.status(status).json({ message: error.message });
	}
};

export const uploadAvatar = async (req, res) => {
	 try {
		 if (!req.file) {
			 return res.status(400).json({ message: "No image file provided" });
		 }
         
		 const user = await userService.updateAvatar(req.user.id, req.file.cloudinaryUrl);
		 res.json(user);
	 } catch (error) {
		 res.status(500).json({ message: error.message });
	 }
};

export const getGameHistory = async (req, res) => {
	try {
		const sessions = await userService.getGameHistory(req.user.id, req.query);
		res.json(sessions);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};