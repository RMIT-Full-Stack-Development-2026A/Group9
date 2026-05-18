import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * useMultiplayer Hook
 * Manages real-time multiplayer game state over WebSocket
 * Handles socket connection, move synchronization, and game lifecycle
 */
export const useMultiplayer = (sessionId, userId, playerMarker) => {
	const [socket, setSocket] = useState(null);
	const [board, setBoard] = useState([]);
	const [boardSize, setBoardSize] = useState(10);
	const [gameState, setGameState] = useState({
		turn: 'X',
		winner: null,
		draw: false,
		isLoading: false,
		moveCount: 0,
	});
	const [error, setError] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!sessionId || !userId) return;

		try {
			// Create socket connection with authentication
			const token = localStorage.getItem('authToken');
			if (!token) {
				setError('No authentication token found');
				return;
			}

			const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000', {
				auth: { token },
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionAttempts: 5,
			});

			// Connection events
			newSocket.on('connect', () => {
				setIsConnected(true);
				setError(null);
			});

			newSocket.on('connect_error', (err) => {
				setError(`Connection error: ${err.message}`);
				setIsConnected(false);
			});

			newSocket.on('disconnect', () => {
				setIsConnected(false);
			});

			// Game events
			newSocket.on('game:board_state', (data) => {
				setBoard(data.board);
				setBoardSize(data.boardSize);
				setGameState((prev) => ({
					...prev,
					moveCount: data.moveCount,
					turn: data.moveCount % 2 === 0 ? 'X' : 'O',
				}));
			});

			newSocket.on('game:board_updated', (data) => {
				setBoard(data.board);
				setGameState((prev) => ({
					...prev,
					turn: data.nextTurn,
					moveCount: data.moveCount,
					isLoading: false,
				}));
			});

			newSocket.on('game:finished', (data) => {
				setGameState((prev) => ({
					...prev,
					winner: data.winner,
					draw: data.draw,
					isLoading: false,
				}));
			});

			newSocket.on('game:opponent_left', (data) => {
				setGameState((prev) => ({
					...prev,
					winner: playerMarker, // Current player wins by forfeit
					isLoading: false,
				}));
				setError('Opponent disconnected. You win by forfeit.');
			});

			newSocket.on('game:player_disconnected', () => {
				setError('Opponent disconnected');
			});

			newSocket.on('error', (err) => {
				setError(err.message || 'Socket error occurred');
			});

			setSocket(newSocket);

			// Cleanup on unmount
			return () => {
				newSocket.disconnect();
			};
		} catch (err) {
			setError(err.message);
		}
	}, [sessionId, userId]);

	/**
	 * Send a move to the server
	 * Optimistically updates local state while waiting for server confirmation
	 */
	const sendMove = (moveIdx) => {
		if (!socket || !isConnected || gameState.winner || gameState.draw) {
			setError('Cannot make move at this time');
			return;
		}

		setGameState((prev) => ({ ...prev, isLoading: true }));

		socket.emit('game:move', {
			sessionId,
			moveIdx,
			marker: playerMarker,
			playerId: userId,
		});
	};

	/**
	 * Leave the game
	 * Notifies server for forfeit handling
	 */
	const leaveGame = () => {
		if (socket && isConnected) {
			socket.emit('game:leave', {
				sessionId,
				playerId: userId,
			});
			socket.disconnect();
		}
	};

	return {
		socket,
		board,
		boardSize,
		gameState,
		error,
		isConnected,
		sendMove,
		leaveGame,
	};
};

export default useMultiplayer;
