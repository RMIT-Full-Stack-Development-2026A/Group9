/**
 * ============================================================================
 * MULTIPLAYER CONTROLLER (The Lobby Manager)
 * ============================================================================
 * Purpose: This file handles the HTTP-based lifecycle of a multiplayer game. 
 * While the actual gameplay moves might happen over WebSockets (Socket.io), 
 * the "Initial Handshake"—creating a room, joining a lobby, and searching for 
 * matches—starts here.
 * * Key Responsibilities:
 * 1. Room Creation: Handling the POST request to start a private or public room.
 * 2. Matchmaking: Initializing the search for an available opponent.
 * 3. Lobby Management: Fetching a list of active "Waiting" games.
 * * CRITICAL RULE: The Controller should not manage Socket connections 
 * directly. It should use the Multiplayer Service to prepare the database 
 * state so that when the Socket connects, the room is ready.
 */

// Implementation contract:
// 1) Handle HTTP lobby lifecycle only (create/join/list).
// 2) Delegate matchmaking and room transitions to multiplayer service.
// 3) Do not emit socket events directly from this layer.

import * as multiplayerService from '../services/multiplayer.service.js';
import { validateCreateRoomDTO, validateJoinRoomDTO } from '../dto/index.js';

/**
 * POST /api/multiplayer/rooms
 * Create a new public room
 */
export async function createRoom(req, res) {
	try {
		const userId = req.user?._id || req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const { boardSize, player1Marker } = req.body;

		// Validate DTO
		const validation = validateCreateRoomDTO({ boardSize, player1Marker });
		if (!validation.valid) {
			return res.status(400).json({ success: false, errors: validation.errors });
		}

		const room = await multiplayerService.createPublicRoom(userId, {
			boardSize,
			player1Marker,
		});

		res.status(201).json({
			success: true,
			data: room,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
}

/**
 * GET /api/multiplayer/rooms/public
 * List available public rooms
 */
export async function listPublicRooms(req, res) {
	try {
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.min(20, parseInt(req.query.limit) || 10);

		const result = await multiplayerService.getPublicRooms(page, limit);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
}

/**
 * POST /api/multiplayer/rooms/:roomId/join
 * Join an existing room as player 2
 */
export async function joinRoom(req, res) {
	try {
		const userId = req.user?._id || req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const { roomId } = req.params;

		// Validate DTO
		const validation = validateJoinRoomDTO({ roomId });
		if (!validation.valid) {
			return res.status(400).json({ success: false, errors: validation.errors });
		}

		const result = await multiplayerService.joinRoom(roomId, userId);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
}

/**
 * GET /api/multiplayer/rooms/:roomId
 * Get room details
 */
export async function getRoom(req, res) {
	try {
		const { roomId } = req.params;

		const room = await multiplayerService.getRoomById(roomId);

		res.status(200).json({
			success: true,
			data: room,
		});
	} catch (err) {
		res.status(404).json({
			success: false,
			message: err.message,
		});
	}
}

/**
 * POST /api/multiplayer/rooms/:roomId/cancel
 * Cancel a waiting room
 */
export async function cancelRoom(req, res) {
	try {
		const userId = req.user?._id || req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const { roomId } = req.params;

		// Verify user is the room creator (player1)
		const room = await multiplayerService.getRoomById(roomId);
		if (room.player1.id.toString() !== userId.toString()) {
			return res.status(403).json({ success: false, message: 'Only room creator can cancel' });
		}

		const cancelledRoom = await multiplayerService.cancelRoom(roomId);

		res.status(200).json({
			success: true,
			data: { status: cancelledRoom.status, roomId: cancelledRoom._id },
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
}

/**
 * POST /api/multiplayer/cleanup
 * Cleanup expired waiting rooms (admin only)
 */
export async function cleanupRooms(req, res) {
	try {
		// Optional: Add admin check here if needed
		const result = await multiplayerService.cleanupExpiredRooms();

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
}