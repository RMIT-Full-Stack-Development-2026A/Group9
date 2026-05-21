import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../app/providers/AuthProvider';
import ArenaView from '../components/ArenaView/ArenaView';
import { useGame } from '../hooks/useGame';
import useAI from '../hooks/useAI';

/*
	AIGameArena
	- Page mounting an AI-powered match. It composes `useGame` (session
		lifecycle) and `useAI` (AI orchestration) to keep game logic out of the
		UI. The page tracks the last human move index to provide context for
		server-side AI heuristics.
	- Design points:
		* The AI is triggered by `useAI` when it's player2's turn and other
			guards are satisfied.
		* We fetch the username from `AuthContext` for player1 display.
*/
export default function AIGameArena() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useContext(AuthContext);
	const settings = location.state?.settings;
	const [lastPlayerMoveIdx, setLastPlayerMoveIdx] = useState(null);
	const sessionStartedRef = useRef(false); // Prevent double session creation

	const {
		board,
		turn,
		winner,
		draw,
		winLine,
		loading,
		startSession,
		playMove,
		playAIMove,
		abortCurrentSession,
		session,
	} = useGame();

	// Start session with correct settings - only once
	useEffect(() => {
		if (!settings) {
			navigate('/');
			return;
		}
		if (!session && !sessionStartedRef.current) {
			sessionStartedRef.current = true;
			setLastPlayerMoveIdx(null);
			startSession({
				...settings,
				gameType: 'ai',
			});
		}
	}, [settings, startSession, navigate, session]);

	// Configure the AI orchestrator to call `playAIMove` when appropriate.
	useAI({
		enabled: true,
		session,
		turn,
		winner,
		draw,
		loading,
		board,
		lastPlayerMoveIdx,
		aiMarker: settings?.player2?.marker,
		aiLevel: settings?.aiLevel,
		onAIMove: playAIMove,
	});

	const matchData = {
		size: settings?.boardSize || 10,
		style: settings?.boardStyle?.toLowerCase() || 'classic',
		gameType: 'ai',
		isOfflineMatch: true,
		player1Name: user?.username || user?.name || 'Player 1',
		player2Name: settings?.player2?.name || 'AI',
		player1Avatar: null,
		player2Avatar: null,
		winningLine: Array.isArray(winLine) ? winLine : [],
		p1Marker: settings?.player1?.marker || 'X',
		p2Marker: settings?.player2?.marker || 'O',
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

	return (
		<ArenaView
			matchData={matchData}
			xIsNext={turn === 'player1'}
			resultName={resultName}
			isLocked={loading || Boolean(winner) || draw}
			onCellClick={(idx) => {
				if (turn !== 'player1') return;
				setLastPlayerMoveIdx(idx);
				playMove(idx, matchData.p1Marker, 'player1');
			}}
			isOfflineMatch={true}
			onAbort={async () => {
				await abortCurrentSession();
				navigate('/');
			}}
			onPlayAgain={() => {
				sessionStartedRef.current = false; // Reset for next session
				setLastPlayerMoveIdx(null);
				startSession({
					...settings,
					gameType: 'ai',
				});
			}}
			onExit={() => navigate('/')}
		/>
	);
}