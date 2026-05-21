import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArenaView from '../../game/components/ArenaView/ArenaView';
import ChatPanel from '../components/ChatPanel/ChatPanel';
import { useOnlineGame } from '../hooks/useOnlineGame';
import { useChat } from '../components/ChatPanel/hooks/useChat';

/*
  OnlineGameArena
  - Page wiring that composes `useOnlineGame` (real-time game state) and
	`useChat` to render the multiplayer arena with a chat sidebar.
  - Handles initialization from navigation `state` (create vs join) and
	redirects back to lobby if required state is missing.
*/
export default function OnlineGameArena() {
	const navigate = useNavigate();
	const location = useLocation();
	const settings = location.state?.settings;
	const roomFromState = location.state?.room;
	const action = location.state?.action;
	const chosenMarker = location.state?.marker;
	const initializedRef = useRef(false);
	const redirectedRef = useRef(false);

	const {
		session,
		room,
		board,
		turn,
		winner,
		draw,
		winLine,
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
	} = useOnlineGame();

	// Chat hook subscribes only when `connected` becomes true
	const { messages, sendMessage, messagesEndRef } = useChat(room?._id, connected);

	// If state was lost (e.g. page reload), redirect to lobby
	useEffect(() => {
		if (!settings && !roomFromState) {
			if (!redirectedRef.current) {
				redirectedRef.current = true;
				navigate('/multiplayer', { replace: true });
			}
		}
	}, [settings, roomFromState, navigate]);

	// Initialize: create room or join existing
	useEffect(() => {
		if (initializedRef.current) return;
		if (!settings && !roomFromState) return;

		initializedRef.current = true;

		const init = async () => {
			try {
				if (action === 'join' && roomFromState) {
					await joinExistingRoom(roomFromState._id, chosenMarker);
				} else if (settings) {
					await createAndJoinRoom(settings);
				}
			} catch (err) {
				console.error('Failed to initialize game:', err);
				navigate('/multiplayer', { replace: true });
			}
		};
		init();
	}, [settings, roomFromState, action, createAndJoinRoom, joinExistingRoom, navigate]);

	// If no room yet, show loading state
	if (!room && !loading) {
		return (
			<div style={{
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				minHeight: '60vh', color: 'var(--text-muted)', fontSize: '1.1em',
			}}>
				Redirecting to lobby...
			</div>
		);
	}

	// Prepare matchData passed to ArenaView
	const boardSize = room?.boardSize || settings?.boardSize || 10;
	const boardStyle = (settings?.boardStyle || room?.boardStyle || 'Classic').toLowerCase();

	const matchData = {
		size: boardSize,
		style: boardStyle,
		gameType: 'multiplayer',
		isOfflineMatch: false,
		roomId: room?._id,
		sessionId: room?.sessionId,
		player1Name: playerNumber === 'player1'
			? (settings?.player1Name || room?.player1?.username || 'You')
			: (room?.player1?.username || 'Opponent'),
		player2Name: playerNumber === 'player2'
			? (room?.player2?.username || settings?.player1Name || 'You')
			: (room?.player2?.username || '?'),
		player1Avatar: room?.player1?.avatar || null,
		player2Avatar: room?.player2?.avatar || null,
		winningLine: Array.isArray(winLine) ? winLine : [],
		p1Marker: playerNumber === 'player1' ? (playerMarker || '-') : (room?.player1Marker || 'X'),
		p2Marker: playerNumber === 'player2' ? (playerMarker || '-') : (room?.player2Marker || '-'),
		boardState: Array.isArray(board) ? board : [],
	};

	const resultName = winner
		? (winner === matchData.p1Marker
			? matchData.player1Name
			: winner === matchData.p2Marker
				? matchData.player2Name
				: winner)
		: draw
			? 'Draw'
			: null;

	// Explicit outcome for the current player: winner marker matches playerMarker → win
	const outcome = winner
		? (winner === playerMarker ? 'win' : 'loss')
		: draw ? 'draw' : null;

	const isMyTurn = turn === playerNumber;
	const isLocked = loading || !connected || !opponentJoined || Boolean(winner) || draw || !isMyTurn;

	const handleCellClick = (idx) => {
		// Defensive logging to help debug client-side blocking cases
		console.log('[CLICK] idx=', idx,
			'| isLocked=', isLocked,
			'| loading=', loading,
			'| connected=', connected,
			'| opponentJoined=', opponentJoined,
			'| winner=', winner,
			'| draw=', draw,
			'| isMyTurn=', isMyTurn,
			'| turn=', turn,
			'| playerNumber=', playerNumber,
			'| session=', session?._id?.slice(-6) || null,
			'| playerMarker=', playerMarker,
			'| boardLen=', board?.length || 0);
		if (isLocked) return;
		console.log('[CLICK] playMove about to call with idx=', idx);
		playMove(idx);
	};

	return (
		<ArenaView
			matchData={matchData}
			xIsNext={turn === 'player1'}
			resultName={resultName}
			isLocked={isLocked}
			outcome={outcome}
			onCellClick={handleCellClick}
			onAbort={abortGame}
			onPlayAgain={() => navigate('/multiplayer')}
			onExit={() => navigate('/multiplayer')}
			sidebarChildren={
				<ChatPanel
					messages={messages}
					onSend={sendMessage}
					messagesEndRef={messagesEndRef}
				/>
			}
		/>
	);
}
