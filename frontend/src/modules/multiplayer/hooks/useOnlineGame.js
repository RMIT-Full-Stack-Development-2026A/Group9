import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket.service.js';
import * as multiplayerApi from '../services/multiplayer.api.js';

export function useOnlineGame() {
	const navigate = useNavigate();

	const [session, setSession] = useState(null);
	const [room, setRoom] = useState(null);
	const [board, setBoard] = useState([]);
	const [turn, setTurn] = useState('player1');
	const [winner, setWinner] = useState(null);
	const [winLine, setWinLine] = useState(null);
	const [draw, setDraw] = useState(false);
	const [connected, setConnected] = useState(false);
	const [playerMarker, setPlayerMarker] = useState(null);
	const [playerNumber, setPlayerNumber] = useState(null);
	const [opponentJoined, setOpponentJoined] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const stateRef = useRef({ session, board, turn, winner, draw, playerNumber });
	stateRef.current = { session, board, turn, winner, draw, playerNumber };
	const roomIdRef = useRef(null);

	// ── Poll room for latest state (fallback if WebSocket event missed) ──
	const syncRoomState = useCallback(async (roomId) => {
		try {
			const res = await multiplayerApi.getRoom(roomId);
			const r = res.data || res;
			console.log('[syncRoomState] room status=', r.status,
				'sessionId=', r.sessionId?.toString?.()?.slice(-6) || r.sessionId?.slice?.(-6) || null,
				'player2=', !!r.player2);
			if (r.sessionId) {
				setSession((prev) => {
					if (prev?._id === r.sessionId?.toString?.() || prev?._id === r.sessionId) return prev;
					console.log('[syncRoomState] Setting session:', r.sessionId?.toString?.()?.slice(-6) || r.sessionId?.slice?.(-6));
					return { _id: r.sessionId, boardSize: r.boardSize || 10 };
				});
			}
			if (r.player2) {
				setOpponentJoined(true);
				setRoom((prev) => prev ? {
					...prev,
					player2: r.player2,
					player2Marker: r.player2Marker || prev.player2Marker,
					status: r.status || prev.status,
				} : prev);
			}
		} catch (e) {
			console.log('[syncRoomState] error:', e.message);
		}
	}, []);

	// ── Setup socket listeners ────────────────────────────────────────
	const setupListeners = useCallback(() => {
		const socket = getSocket();
		if (!socket) return;

		socket.off('connect');
		socket.off('disconnect');
		socket.off('game:state-update');
		socket.off('game:over');
		socket.off('room:player-joined');
		socket.off('room:player-left');
		socket.off('room:closed');
		socket.off('error');

		socket.on('connect', () => {
			console.log('[SOCKET] connect event, roomIdRef=', roomIdRef.current?.slice(-6));
			setConnected(true);
			if (roomIdRef.current) {
				socket.emit('room:join', { roomId: roomIdRef.current });
				syncRoomState(roomIdRef.current);
			}
		});
		socket.on('disconnect', () => setConnected(false));
		if (socket.connected) {
			setConnected(true);
		}

		socket.on('room:player-joined', (data) => {
			console.log('[SOCKET] room:player-joined received', data);
			setOpponentJoined(true);
			if (data.sessionId) {
				console.log('[SOCKET] Setting session from room:player-joined:', data.sessionId?.slice(-6));
				setSession({ _id: data.sessionId, boardSize: data.boardSize || 10 });
			}
			setRoom((prev) => prev ? {
				...prev,
				player2: { username: data.opponentName || 'Opponent' },
				player2Marker: data.opponentMarker || prev.player2Marker,
			} : prev);
		});

		socket.on('game:state-update', (data) => {
			console.log('[SOCKET] game:state-update received boardLen=', data.board?.length, 'turn=', data.turn, 'winner=', data.winner, 'draw=', data.draw);
			setBoard(data.board);
			setTurn(data.turn);
			if (data.winner) setWinner(data.winner);
			if (data.winLine) setWinLine(data.winLine);
			if (data.draw) setDraw(true);
		});

		socket.on('game:over', (data) => {
			if (data.winner) setWinner(data.winner);
			if (data.winLine) setWinLine(data.winLine);
			if (data.draw) setDraw(true);
		});

		socket.on('room:player-left', () => {
			setOpponentJoined(false);
		});

		socket.on('room:closed', () => {
			disconnectSocket();
			navigate('/multiplayer');
		});

		socket.on('error', (data) => {
			setError(data.message);
		});
	}, [syncRoomState]);

	// ── Create a room and join it ─────────────────────────────────────
	const createAndJoinRoom = useCallback(async (settings) => {
		setLoading(true);
		setError(null);
		try {
			const firstPlayerServer = settings.firstPlayer === 'Opponent' ? 'player2' : 'player1';
			const response = await multiplayerApi.createRoom({
				boardSize: settings.boardSize,
				marker: settings.marker,
				firstPlayer: firstPlayerServer,
			});
			const createdRoom = response.data || response;
			const size = createdRoom.boardSize || settings.boardSize || 10;

			setRoom(createdRoom);
			setPlayerMarker(createdRoom.player1Marker);
			setPlayerNumber('player1');
			setTurn(firstPlayerServer === 'player1' ? 'player1' : 'player2');
			setBoard(Array(size * size).fill(null));
			roomIdRef.current = createdRoom._id;

			const socket = connectSocket();
			setupListeners();

			socket.emit('room:join', { roomId: createdRoom._id });

			return createdRoom;
		} catch (err) {
			setError(err.response?.data?.message || err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [setupListeners]);

	// ── Join an existing room ─────────────────────────────────────────
	const joinExistingRoom = useCallback(async (roomId) => {
		setLoading(true);
		setError(null);
		try {
			const response = await multiplayerApi.joinRoom(roomId);
			const joinedRoom = response.data || response;

			// If creator chose to go second, player 2 goes first
			const creatorFirst = joinedRoom.firstPlayer || 'player1';
			const initialTurn = creatorFirst === 'player1' ? 'player1' : 'player2';

			setRoom(joinedRoom);
			setSession({ _id: joinedRoom.sessionId, boardSize: joinedRoom.boardSize });
			setBoard(Array(joinedRoom.boardSize * joinedRoom.boardSize).fill(null));
			setPlayerMarker(joinedRoom.player2Marker);
			setPlayerNumber('player2');
			setTurn(initialTurn);
			setOpponentJoined(true);
			roomIdRef.current = joinedRoom._id;

			const socket = connectSocket();
			setupListeners();

			socket.emit('room:join', { roomId });

			return joinedRoom;
		} catch (err) {
			setError(err.response?.data?.message || err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [setupListeners]);

	// ── Play a move ───────────────────────────────────────────────────
	const playMove = useCallback((idx) => {
		const socket = getSocket();
		const { session: s, playerNumber: pn } = stateRef.current;
		console.log('[playMove] idx=', idx,
			'| socket=', !!socket,
			'| socket.connected=', socket?.connected,
			'| session=', s?._id?.slice(-6) || null,
			'| playerNumber=', pn,
			'| playerMarker=', playerMarker);
		if (!socket) { console.log('[playMove] BLOCKED: no socket'); return; }
		if (!s) { console.log('[playMove] BLOCKED: no session (stateRef)'); return; }
		if (!pn) { console.log('[playMove] BLOCKED: no playerNumber'); return; }

		console.log('[playMove] EMIT game:move sessionId=', s._id?.slice(-6), 'idx=', idx, 'marker=', playerMarker, 'playerId=', pn);
		socket.emit('game:move', {
			sessionId: s._id,
			idx,
			marker: playerMarker,
			playerId: pn,
		});
	}, [playerMarker]);

	// ── Abort the game (closes room for everyone) ─────────────────────
	const abortGame = useCallback(() => {
		const socket = getSocket();
		if (socket && roomIdRef.current) {
			socket.emit('room:leave', { roomId: roomIdRef.current });
		}
		disconnectSocket();
		navigate('/multiplayer');
	}, [navigate]);

	// ── Cleanup on unmount (just disconnect, don't close room) ────────
	useEffect(() => {
		return () => {
			disconnectSocket();
		};
	}, []);

	return {
		session,
		room,
		board,
		turn,
		winner,
		winLine,
		draw,
		connected,
		playerMarker,
		playerNumber,
		opponentJoined,
		loading,
		error,
		createAndJoinRoom,
		joinExistingRoom,
		playMove,
		abortGame,
	};
}
