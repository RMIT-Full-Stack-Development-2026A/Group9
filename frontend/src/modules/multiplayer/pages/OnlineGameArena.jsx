import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArenaView from '../../game/components/ArenaView/ArenaView';
import ChatPanel from '../components/ChatPanel';
import { useOnlineGame } from '../hooks/useOnlineGame';
import { useChat } from '../hooks/useChat';

export default function OnlineGameArena() {
	const navigate = useNavigate();
	const location = useLocation();
	const settings = location.state?.settings;
	const roomFromState = location.state?.room;
	const action = location.state?.action;
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
					await joinExistingRoom(roomFromState._id);
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

	const boardSize = room?.boardSize || settings?.boardSize || 10;
	const boardStyle = settings?.boardStyle?.toLowerCase() || 'classic';

	const matchData = {
		size: boardSize,
		style: boardStyle,
		gameType: 'multiplayer',
		isOfflineMatch: false,
		player1Name: playerNumber === 'player1'
			? (settings?.player1Name || 'You')
			: (room?.player1?.username || 'Opponent'),
		player2Name: playerNumber === 'player2'
			? (settings?.player1Name || 'You')
			: (room?.player2?.username || 'Waiting...'),
		player1Avatar: null,
		player2Avatar: null,
		winningLine: Array.isArray(winLine) ? winLine : [],
		p1Marker: playerNumber === 'player1' ? playerMarker : (room?.player1Marker || 'X'),
		p2Marker: playerNumber === 'player2' ? playerMarker : (room?.player2Marker || 'O'),
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

	const isMyTurn = turn === playerNumber;
	const isLocked = loading || !connected || !opponentJoined || Boolean(winner) || draw || !isMyTurn;

	const handleCellClick = (idx) => {
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
