import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArenaView from '../components/ArenaView/ArenaView';
import { useGame } from '../hooks/useGame';

export default function LocalGameArena() {
    const navigate = useNavigate();
    const location = useLocation();
    const settings = location.state?.settings;
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
        abortCurrentSession,
        session,
    } = useGame();

    // Start session with correct settings - only once
    useEffect(() => {
        if (!settings) {
            navigate('/game-lobby');
            return;
        }
        // Ensure player2Name is set for local games
        if (!settings.localPlayer2Name && settings.player2?.name) {
            settings.localPlayer2Name = settings.player2.name;
        }
        if (!session && !sessionStartedRef.current) {
            sessionStartedRef.current = true;
            startSession(settings);
        }
    }, [settings, startSession, navigate, session]);

    const matchData = {
        size: settings?.boardSize || 10,
        style: settings?.boardStyle?.toLowerCase() || 'classic',
        gameType: settings?.gameType || 'local',
        isOfflineMatch: true,
        player1Name: settings?.player1?.name || 'Player 1',
        player2Name: settings?.player2?.name || settings?.localPlayer2Name || 'Player 2',
        player1Avatar: settings?.player1?.avatar || null,
        player2Avatar: settings?.player2?.avatar || null,
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
            onCellClick={(idx) => playMove(
                idx,
                turn === 'player1' ? matchData.p1Marker : matchData.p2Marker,
                turn
            )}
            isOfflineMatch={true}
            onAbort={async () => {
                await abortCurrentSession();
                navigate('/game-lobby');
            }}
            onPlayAgain={() => {
                sessionStartedRef.current = false; // Reset for next session
                startSession(settings);
            }}
            onExit={() => navigate('/')}
        />
    );
}