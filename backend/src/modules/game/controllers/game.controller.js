/**
 * ============================================================================
 * GAME CONTROLLER (The Match Referee)
 * ============================================================================
 * Purpose: This file handles all HTTP requests related to gameplay, match 
 * history, and player statistics. It acts as the bridge between the 
 * "TicTacToang" frontend and the Game Service.
 * * Key Responsibilities:
 * 1. Extract game move data or Room IDs from the request.
 * 2. Pass that data to the Game Service to process the move/logic.
 * 3. Send the appropriate HTTP response (e.g., 200 OK with the new board state).
 * 4. Handle real-time game creation requests.
 * * CRITICAL RULE: A Controller should NEVER contain the logic for checking 
 * a "Win Condition" or "Draw." It strictly manages the communication flow.
 */

import { validateMovePayload } from "../dto/game.dto.js";
import * as gameFacade from "../facade/game.facade.js";

export const createSession = async (req, res, next) => {
	try {
		// Controller delegates game creation to facade and returns HTTP response only.
		const session = await gameFacade.createGame(req.body);
		return res.status(201).json({ success: true, data: session });
	} catch (error) {
		return next(error);
	}
};

export const makeMove = async (req, res, next) => {
	try {
		// Validate request shape before forwarding move to game facade.
		const { session, move } = req.body || {};
		const moveValidation = validateMovePayload(move || {}, session?.boardSize || 3);

		if (!moveValidation.valid) {
			return res.status(400).json({ success: false, errors: moveValidation.errors });
		}

		const nextSession = await gameFacade.makeMove(session, moveValidation.value);
		return res.status(200).json({ success: true, data: nextSession });
	} catch (error) {
		return next(error);
	}
};