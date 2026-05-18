/**
 * ============================================================================
 * GAME SOCKET HANDLER (Real-Time Game State Sync)
 * ============================================================================
 * Purpose: Handles real-time multiplayer game moves, state synchronization,
 * and game lifecycle events over WebSocket. Integrates with game logic layer
 * for validation and persistence.
 */

import { GameInterface } from '../../modules/game/interface/game.interface.js';
import * as multiplayerService from '../../modules/multiplayer/services/multiplayer.service.js';

// Track active game sessions by room
const activeGames = new Map();

export default function registerGameSocketHandlers(io, socket) {
	/**
	 * Player joins a game room
	 * Validates session and emits player join notification
	 */
	socket.on('game:join', async ({ sessionId, roomId } = {}) => {
		try {
			if (!sessionId || !roomId) {
				socket.emit('error', { message: 'sessionId and roomId required' });
				return;
			}

			// Fetch session to validate
			const session = await GameInterface.getSessionById(sessionId);
			if (!session) {
				socket.emit('error', { message: 'Session not found' });
				return;
			}

			// Validate user is player1 or player2
			const userId = socket.userId;
			const isPlayer1 = session.player1.toString() === userId.toString();
			const isPlayer2 = session.player2.toString() === userId.toString();

			if (!isPlayer1 && !isPlayer2) {
				socket.emit('error', { message: 'Not authorized for this session' });
				return;
			}

			// Join socket room
			socket.join(roomId);
			socket.sessionId = sessionId;
			socket.roomId = roomId;
			socket.playerId = userId;
			socket.isPlayer1 = isPlayer1;

			// Determine player markers
			const playerMarker = isPlayer1 ? 'X' : 'O';
			socket.marker = playerMarker;

			// Notify room that player joined
			io.to(roomId).emit('game:player_joined', {
				playerId: userId,
				playerNumber: isPlayer1 ? 1 : 2,
				marker: playerMarker,
				timestamp: new Date().toISOString(),
			});

			// Send current board state to joining player
			socket.emit('game:board_state', {
				board: session.board,
				boardSize: session.boardSize,
				player1Marker: 'X',
				player2Marker: 'O',
				moveCount: session.board.filter(cell => cell !== null && cell !== undefined).length,
			});
		} catch (err) {
			socket.emit('error', { message: err.message });
		}
	});

	/**
	 * Player makes a move
	 * Validates move, applies it, persists it, and broadcasts updated board
	 */
	socket.on('game:move', async ({ sessionId, moveIdx, marker, playerId } = {}) => {
		try {
			if (sessionId !== socket.sessionId) {
				socket.emit('error', { message: 'Session mismatch' });
				return;
			}

			if (!sessionId || moveIdx === undefined || !marker || !playerId) {
				socket.emit('error', { message: 'Missing move parameters' });
				return;
			}

			// Fetch session
			const session = await GameInterface.getSessionById(sessionId);
			if (!session) {
				socket.emit('error', { message: 'Session not found' });
				return;
			}

			// Check game not finished
			if (session.result) {
				socket.emit('error', { message: 'Game is already finished' });
				return;
			}

			// Validate move using multiplayer service
			await multiplayerService.validateGameMove({
				sessionId,
				playerId,
				moveIdx,
				marker,
				currentBoard: session.board,
				boardSize: session.boardSize,
			});

			// Calculate expected turn based on move count
			const moveCount = session.board.filter(cell => cell !== null && cell !== undefined).length;
			const expectedMarker = moveCount % 2 === 0 ? 'X' : 'O';

			if (marker !== expectedMarker) {
				socket.emit('error', { message: 'Not your turn' });
				return;
			}

			// Apply move and get result
			const moveResult = GameInterface.applyMove({
				board: session.board,
				size: session.boardSize,
				idx: moveIdx,
				marker,
			});

			// Prepare move data for persistence
			const row = Math.floor(moveIdx / session.boardSize);
			const col = moveIdx % session.boardSize;
			const moveData = {
				playerId: socket.isPlayer1 ? 'player1' : 'player2',
				marker,
				position: `${row},${col}`,
				row,
				col,
				moveNumber: moveCount + 1,
			};

			// Prepare session updates
			const updateExtra = {};
			if (moveResult.winner) {
				updateExtra.result = socket.isPlayer1 ? 'player1_win' : 'player2_win';
				updateExtra.winner = playerId;
				updateExtra.winnerMarker = marker;
				updateExtra.endTime = new Date();
			} else if (moveResult.draw) {
				updateExtra.result = 'draw';
				updateExtra.endTime = new Date();
			}

			// Persist move to database
			await GameInterface.appendMove(sessionId, moveResult.board, moveResult, moveData, updateExtra);

			// Broadcast updated board to all players in room
			io.to(socket.roomId).emit('game:board_updated', {
				board: moveResult.board,
				boardSize: session.boardSize,
				lastMove: { idx: moveIdx, marker, playerNumber: socket.isPlayer1 ? 1 : 2 },
				moveCount: moveCount + 1,
				nextTurn: moveResult.winner ? null : (moveCount + 1) % 2 === 0 ? 'X' : 'O',
				timestamp: new Date().toISOString(),
			});

			// If game ended, broadcast game finished event
			if (moveResult.winner || moveResult.draw) {
				io.to(socket.roomId).emit('game:finished', {
					winner: moveResult.winner || null,
					winLine: moveResult.winLine || null,
					draw: moveResult.draw || false,
					result: updateExtra.result,
					timestamp: new Date().toISOString(),
				});
			}
		} catch (err) {
			socket.emit('error', { message: err.message });
		}
	});

	/**
	 * Player leaves the game
	 * Sets opponent as winner (forfeit) and updates session
	 */
	socket.on('game:leave', async ({ sessionId, playerId } = {}) => {
		try {
			if (!sessionId || !playerId) {
				return;
			}

			// Fetch session
			const session = await GameInterface.getSessionById(sessionId);
			if (!session || session.result) {
				return; // Game already finished or session doesn't exist
			}

			// Determine opponent
			const opponentWins = socket.isPlayer1 ? 'player2_win' : 'player1_win';

			// Update session with forfeit result
			await GameInterface.appendMove(
				sessionId,
				session.board,
				{ board: session.board, winner: null, draw: false },
				null,
				{
					result: opponentWins,
					winner: socket.isPlayer1 ? session.player2 : session.player1,
					endTime: new Date(),
				}
			);

			// Notify other players
			socket.to(socket.roomId).emit('game:opponent_left', {
				playerId,
				result: opponentWins,
				timestamp: new Date().toISOString(),
			});

			// Leave room
			socket.leave(socket.roomId);
		} catch (err) {
			console.error('Error in game:leave handler:', err);
		}
	});

	/**
	 * Handle socket disconnect
	 * Clean up active game state
	 */
	socket.on('disconnect', () => {
		if (socket.sessionId && socket.roomId) {
			// Emit disconnect notification
			socket.to(socket.roomId).emit('game:player_disconnected', {
				playerId: socket.userId,
				timestamp: new Date().toISOString(),
			});

			// Clean up
			socket.leave(socket.roomId);
			if (activeGames.has(socket.roomId)) {
				activeGames.delete(socket.roomId);
			}
		}
	});
}