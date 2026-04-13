/**
 * ============================================================================
 * GAME ARENA PAGE (The Stage)
 * ============================================================================
 * Location: src/pages/GameArena.jsx
 * Purpose: This is the primary gameplay screen. It assembles the Board, 
 * Chat, and Player Stats components from the 'game' and 'chat' modules.
 * * Key Responsibilities:
 * 1. Layout Management: Positioning the board vs. the chat sidebar.
 * 2. Room Initialization: Extracting the 'gameId' from the URL.
 * 3. Error Boundary: Showing a "Game Not Found" state if the ID is invalid.
 */
import React, { useState } from 'react';
import CustomizationModal from '../components/CustomizationModal';
import GameBoard from '../components/GameBoard/GameBoard';
import GameStatus from '../components/GameStatus/GameStatus'; 
import './GameArena.css';

const MARKERS = ['X', '👻', '🔥', '⚡', '💎', '💖'];
const O_MARKERS = ['O', '👾', '💧', '🛡️', '💠', '🖤']; 

export default function GameArena() {
    const [isConfiguring, setIsConfiguring] = useState(true);
    const [xIsNext, setXIsNext] = useState(true); // Tracks turns
    const [matchData, setMatchData] = useState({
        size: 10,
        style: 'neon',
        markerIndex: 0,
        startTime: null,
        boardState: [],
        moveHistory: []
    });

    const handleStartMatch = (finalSettings) => {
        const startTime = new Date().toISOString();
        const initialBoard = Array(finalSettings.size * finalSettings.size).fill(null);
        
        setMatchData({
            ...finalSettings,
            startTime,
            boardState: initialBoard,
            moveHistory: []
        });
        
        setXIsNext(true); //resets turn to player1
        setIsConfiguring(false);
    };

    const handleCellClick = (index) => {
        //prevent double clicking on cells, determine which players turn, updates score board
        if (matchData.boardState[index]) return;

        const currentPlayer = xIsNext ? 'X' : 'O';
        
        const displayMarker = xIsNext ? MARKERS[matchData.markerIndex] : O_MARKERS[matchData.markerIndex];

        const newBoard = [...matchData.boardState];
        newBoard[index] = displayMarker; 

        setMatchData(prev => ({
            ...prev,
            boardState: newBoard,
            moveHistory: [
                ...prev.moveHistory,
                {
                    player: currentPlayer,
                    index: index,
                    time: new Date().toISOString()
                }
            ]
        }));

        setXIsNext(!xIsNext);
    };

    if (isConfiguring) {
        return <CustomizationModal onStart={handleStartMatch} currentSettings={matchData} />;
    }

    return (
        <div className={`arena-page ${matchData.style}-theme`}>
            <div className="arena-content">
                
                {/*the board*/}
                <main className="match-stage">
                    <div className="player-dashboard">
					{/*player1 card*/}
					<div className={`player-card ${xIsNext ? 'active-turn' : ''}`}>
						<div className="player-avatar">P1</div>
						<div className="marker-display">{MARKERS[matchData.markerIndex]}</div>
					</div>

					<div className="vs-badge">VS</div>

					{/*player2 card*/}
					<div className={`player-card ${!xIsNext ? 'active-turn' : ''}`}>
						<div className="marker-display">{O_MARKERS[matchData.markerIndex]}</div>
						<div className="player-avatar">P2</div>
					</div>
				</div>
                    
                    <div className="board-wrapper">
                        <GameBoard 
                            size={matchData.size} 
                            styleType={matchData.style} 
                            markerIndex={matchData.markerIndex}
                            boardState={matchData.boardState}
                            onCellClick={handleCellClick}
                        />
                    </div>

                    <button className="abort-btn" onClick={() => setIsConfiguring(true)}>
                        Abort Match
                    </button>
                </main>

                {/*sidebar*/}
                <aside className="arena-sidebar">
                    <div className="sidebar-panel">
                        <h3>Match Details</h3>
                        <p>Grid: {matchData.size}x{matchData.size}</p>
                        <p>Theme: {matchData.style}</p>
                        <p>Moves: {matchData.moveHistory.length}</p>
                    </div>
                    
                    <div className="sidebar-panel chat-panel">
                        <h3>Room Chat</h3>
                        <div className="chat-box">
                            <p className="system-msg">Match started...</p>
                        </div>
                        <input type="text" placeholder="Send a message..." className="chat-input" />
                    </div>
                </aside>
            </div>
        </div>
    );
}