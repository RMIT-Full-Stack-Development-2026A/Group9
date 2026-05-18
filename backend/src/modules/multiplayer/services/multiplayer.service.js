/**
 * ============================================================================
 * MULTIPLAYER SERVICE (The Matchmaker / Lobby Logic)
 * ============================================================================
 * Purpose: This file manages the "Social" side of TicTacToang. It handles
 * the logic for pairing human players together, managing the room lifecycle,
 * and ensuring that a game session is ready for real-time WebSocket interaction.
 */

import GameRoom from '../models/gameRoom.model.js';
import GameSession from '../../game/models/gameSession.model.js';
import * as multiplayerRepository from '../repositories/multiplayer.repository.js';

const ROOM_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate a unique room number
 */
async function generateRoomNumber() {
	let roomNumber;
	let exists = true;
	while (exists) {
		roomNumber = Math.floor(Math.random() * 1000000);
		exists = await GameRoom.findOne({ roomNumber });
	}
	return roomNumber;
}

/**
 * Create a new public room
 * @param {string} userId - Player 1 user ID
 * @param {object} settings - Game settings { boardSize, boardStyle, firstPlayer, player1Marker }
 * @returns {object} Created room with roomId, roomNumber, status
 */
export async function createPublicRoom(userId, settings) {
	if (!userId) {
		throw new Error('User ID required');
	}

	const roomNumber = await generateRoomNumber();

	const room = new GameRoom({
		roomNumber,
		player1: userId,
		player2: null,
		status: 'waiting',
		boardSize: settings?.boardSize || 10,
		player1Marker: settings?.player1Marker || 'X',
		player2Marker: settings?.player2Marker || 'O',
	});

	await room.save();

	return {
		roomId: room._id,
		roomNumber: room.roomNumber,
		status: room.status,
		player1: {
			id: room.player1,
			marker: room.player1Marker,
		},
		createdAt: room.createdAt,
	};
}

/**
 * List available public rooms (waiting for player 2)
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {object} { rooms, total, page, limit }
 */
export async function getPublicRooms(page = 1, limit = 10) {
	const skip = (page - 1) * limit;

	// Filter: status is waiting AND room created less than 5 minutes ago AND player2 is null
	const cutoffTime = new Date(Date.now() - ROOM_TIMEOUT_MS);

	const rooms = await GameRoom.find({
		status: 'waiting',
		player2: null,
		createdAt: { $gt: cutoffTime },
	})
		.populate('player1', 'username avatar')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean();

	const total = await GameRoom.countDocuments({
		status: 'waiting',
		player2: null,
		createdAt: { $gt: cutoffTime },
	});

	return {
		rooms: rooms.map(r => ({
			roomId: r._id,
			roomNumber: r.roomNumber,
			player1: {
				id: r.player1._id,
				name: r.player1.username,
				avatar: r.player1.avatar,
				marker: r.player1Marker,
			},
			boardSize: r.boardSize,
			createdAt: r.createdAt,
		})),
		total,
		page,
		limit,
	};
}

/**
 * Join a room as player 2 and create a game session
 * @param {string} roomId - Room ID to join
 * @param {string} userId - Player 2 user ID
 * @returns {object} { sessionId, roomId, gameSession }
 */
export async function joinRoom(roomId, userId) {
	if (!roomId || !userId) {
		throw new Error('Room ID and User ID required');
	}

	// Fetch room
	const room = await GameRoom.findById(roomId).populate('player1', 'username');
	if (!room) {
		throw new Error('Room not found');
	}

	// Validate room state
	if (room.status !== 'waiting') {
		throw new Error('Room is not available');
	}
	if (room.player2) {
		throw new Error('Room is already full');
	}
	if (room.player1.toString() === userId.toString()) {
		throw new Error('Cannot join your own room');
	}

	// Update room with player2
	room.player2 = userId;
	room.status = 'playing';
	room.startTime = new Date();
	await room.save();

	// Create game session
	const session = new GameSession({
		player1: room.player1._id,
		player2: userId,
		player2Name: '', // Will be populated from frontend
		gameType: 'multiplayer',
		boardSize: room.boardSize,
		board: Array(room.boardSize * room.boardSize).fill(null),
		startTime: new Date(),
	});

	await session.save();

	// Update room with session reference
	room.sessionId = session._id;
	await room.save();

	return {
		roomId: room._id,
		roomNumber: room.roomNumber,
		sessionId: session._id,
		gameSession: {
			id: session._id,
			board: session.board,
			boardSize: session.boardSize,
			player1: session.player1,
			player2: session.player2,
			gameType: session.gameType,
		},
		room: {
			status: room.status,
			player1Marker: room.player1Marker,
			player2Marker: room.player2Marker,
		},
	};
}

/**
 * Get room details by room ID
 * @param {string} roomId - Room ID
 * @returns {object} Room with populated player details
 */
export async function getRoomById(roomId) {
	if (!roomId) {
		throw new Error('Room ID required');
	}

	const room = await GameRoom.findById(roomId)
		.populate('player1', 'username avatar')
		.populate('player2', 'username avatar')
		.populate('sessionId');

	if (!room) {
		throw new Error('Room not found');
	}

	return {
		roomId: room._id,
		roomNumber: room.roomNumber,
		status: room.status,
		player1: room.player1
			? {
					id: room.player1._id,
					name: room.player1.username,
					avatar: room.player1.avatar,
					marker: room.player1Marker,
				}
			: null,
		player2: room.player2
			? {
					id: room.player2._id,
					name: room.player2.username,
					avatar: room.player2.avatar,
					marker: room.player2Marker,
				}
			: null,
		boardSize: room.boardSize,
		sessionId: room.sessionId?._id,
		createdAt: room.createdAt,
		startTime: room.startTime,
	};
}

/**
 * Get room by associated session ID
 * @param {string} sessionId - Game session ID
 * @returns {object} Room details
 */
export async function getRoomBySessionId(sessionId) {
	if (!sessionId) {
		throw new Error('Session ID required');
	}

	const room = await GameRoom.findOne({ sessionId })
		.populate('player1', 'username avatar')
		.populate('player2', 'username avatar');

	if (!room) {
		throw new Error('Room not found for session');
	}

	return getRoomById(room._id);
}

/**
 * Update room status
 * @param {string} roomId - Room ID
 * @param {string} status - New status (waiting, playing, finished, cancelled)
 * @returns {object} Updated room
 */
export async function updateRoomStatus(roomId, status) {
	if (!roomId || !status) {
		throw new Error('Room ID and status required');
	}

	const validStatuses = ['waiting', 'playing', 'finished', 'cancelled'];
	if (!validStatuses.includes(status)) {
		throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
	}

	const room = await GameRoom.findByIdAndUpdate(
		roomId,
		{
			status,
			...(status === 'finished' && { endTime: new Date() }),
			...(status === 'cancelled' && { endTime: new Date() }),
		},
		{ new: true }
	);

	if (!room) {
		throw new Error('Room not found');
	}

	return room;
}

/**
 * Cancel a room (set to cancelled status)
 * @param {string} roomId - Room ID
 * @returns {object} Updated room
 */
export async function cancelRoom(roomId) {
	if (!roomId) {
		throw new Error('Room ID required');
	}

	const room = await GameRoom.findById(roomId);
	if (!room) {
		throw new Error('Room not found');
	}

	if (room.status === 'playing' || room.status === 'finished') {
		throw new Error('Cannot cancel an active or finished room');
	}

	return updateRoomStatus(roomId, 'cancelled');
}

/**
 * Clean up expired waiting rooms (> 5 minutes old)
 * Called periodically to maintain lobby hygiene
 * @returns {object} { deletedCount, message }
 */
export async function cleanupExpiredRooms() {
	const cutoffTime = new Date(Date.now() - ROOM_TIMEOUT_MS);

	const result = await GameRoom.updateMany(
		{
			status: 'waiting',
			player2: null,
			createdAt: { $lt: cutoffTime },
		},
		{
			status: 'cancelled',
			endTime: new Date(),
		}
	);

	return {
		modifiedCount: result.modifiedCount,
		message: `Cleaned up ${result.modifiedCount} expired waiting rooms`,
	};
}

/**
 * Validate a move in a multiplayer game
 * @param {object} params - { sessionId, playerId, moveIdx, marker, currentBoard, boardSize }
 * @returns {boolean} Valid move
 */
export async function validateGameMove(params) {
	const { sessionId, playerId, moveIdx, marker, currentBoard, boardSize } = params;

	if (!sessionId || !playerId || moveIdx === undefined || !marker || !currentBoard || !boardSize) {
		throw new Error('Missing move parameters');
	}

	// Fetch session to verify game state
	const session = await GameSession.findById(sessionId);
	if (!session) {
		throw new Error('Session not found');
	}

	if (session.result) {
		throw new Error('Game is already finished');
	}

	if (session.gameType !== 'multiplayer') {
		throw new Error('Not a multiplayer session');
	}

	// Validate move index
	if (moveIdx < 0 || moveIdx >= boardSize * boardSize) {
		throw new Error('Invalid move index');
	}

	// Validate cell is empty
	if (currentBoard[moveIdx] !== null && currentBoard[moveIdx] !== undefined) {
		throw new Error('Cell is already occupied');
	}

	// Validate player is in the session
	const isPlayer1 = session.player1.toString() === playerId.toString();
	const isPlayer2 = session.player2.toString() === playerId.toString();

	if (!isPlayer1 && !isPlayer2) {
		throw new Error('Player is not in this session');
	}

	// Validate marker matches player
	if (isPlayer1 && marker !== 'X') {
		throw new Error('Player 1 marker must be X');
	}
	if (isPlayer2 && marker !== 'O') {
		throw new Error('Player 2 marker must be O');
	}

	return true;
}
