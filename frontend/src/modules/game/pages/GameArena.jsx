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

export default function GameArena() {
    const [isConfiguring, setIsConfiguring] = useState(true);
    const [matchData, setMatchData] = useState({
        size: 10,
        style: 'neon',
        markerIndex: 0,
        startTime: null,
        boardState: [] 
    });

    const handleStartMatch = (finalSettings) => {
        const startTime = new Date().toISOString();
        const initialBoard = Array(finalSettings.size * finalSettings.size).fill(null);
        
        setMatchData({
            ...finalSettings,
            startTime,
            boardState: initialBoard
        });
        
        setIsConfiguring(false);
    };

    const handleCellClick = (index) => {
        const newBoard = [...matchData.boardState];
        if (!newBoard[index]) {
            newBoard[index] = 'X'; 
            setMatchData({ ...matchData, boardState: newBoard });
        }
    };

    if (isConfiguring) {
        return <CustomizationModal onStart={handleStartMatch} currentSettings={matchData} />;
    }

    return (
        <div className={`arena-page ${matchData.style}-theme`}>
            <div className="arena-content">
                
                {/*the board*/}
                <main className="match-stage">
                    <GameStatus markerIndex={matchData.markerIndex} />
                    
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