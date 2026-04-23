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
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import CustomizationModal from '../components/CustomizationModal';
import GameBoard from '../components/GameBoard/GameBoard';
import GameStatus from '../components/GameStatus/GameStatus'; 
import './GameArena.css';

const MARKERS = ['X', '👻', '🔥', '⚡', '💎', '💖'];
const O_MARKERS = ['O', '👾', '💧', '🛡️', '💠', '🖤']; 

export default function GameArena() {
    const [isConfiguring, setIsConfiguring] = useState(true);
    const [xIsNext, setXIsNext] = useState(true);
    const [winnerMessage, setWinnerMessage] = useState(null);
    const navigate = useNavigate();
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
        //prevents double clicking on cells
        if (matchData.boardState[index]) return;

        const currentPlayer = xIsNext ? 'X' : 'O';
        const displayMarker = xIsNext ? MARKERS[matchData.markerIndex] : O_MARKERS[matchData.markerIndex];

        const newBoard = [...matchData.boardState];
        newBoard[index] = displayMarker; 

        //checks for win locally
        const isWin = checkWin(newBoard, index, matchData.size);

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

        if (isWin) {
            const winnerName = xIsNext ? "Player 1" : "Player 2";
            setWinnerMessage(`${winnerName} wins!`);
            compileMatchRecord(`${winnerName} Victory`); 
            return; 
        }

        setXIsNext(!xIsNext);
    };

    const checkWin = (board, lastIndex, size) => {
        const marker = board[lastIndex];
        const row = Math.floor(lastIndex / size);
        const col = lastIndex % size;

        //check win directions
        const directions = [
            [0, 1],//horizontal
            [1, 0],//vetical
            [1, 1],// down-right
            [1, -1]//down-left
        ];

        for (const [dr, dc] of directions) {
            let count = 1;

            //checks forward and backward for each direction
            for (const sign of [1, -1]) {
                for (let i = 1; i < 5; i++) {
                    const r = row + dr * i * sign;
                    const c = col + dc * i * sign;
                    const checkIndex = r * size + c;

                    if (r >= 0 && r < size && c >= 0 && c < size && board[checkIndex] === marker) {
                        count++;
                    } else {
                        break;
                    }
                }
            }

            if (count >= 5) return true;
        }
        return false;
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
						
						<div className="detail-row">
							<span className="detail-icon">🎯</span>
							<span className="detail-label">Board:</span>
							<span className="detail-value">{matchData.size}×{matchData.size}</span>
						</div>

						<div className="detail-row">
							<span className="detail-icon">🎮</span>
							<span className="detail-label">Type:</span>

							{/* placeholder match type */}
							<span className="detail-value">Local Match</span>
						</div>

						<div className="detail-row">
							<span className="detail-icon">🔑</span>
							<span className="detail-label">Room:</span>
							<span className="detail-value room-link">
								{/* placeholder room id */}
								chgifguiqf7y23orh2hukvsdh 
							</span>
						</div>

						<div className="detail-row">
							<span className="detail-icon">📊</span>
							<span className="detail-label">Moves:</span>
							<span className="detail-value">{matchData.moveHistory.length}</span>
						</div>
					</div>
                    
                    <div className="sidebar-panel chat-panel">
                        <h3>Room Chat</h3>
                        <div className="chat-box">
							{/* place holder chat history */}
                            <p className="system-msg">Match started...</p>
                        </div>
                        <input type="text" placeholder="Send a message..." className="chat-input" />
                    </div>
                </aside>
            </div>
            {/*win pop up*/}
            {winnerMessage && (
                <div className="victory-modal-overlay">
                    <div className="victory-modal-content">
                        <h2 className="victory-title">MATCH OVER</h2>
                        <p className="victory-message">{winnerMessage}</p>
                        
                        <div className="victory-actions">
                            <button className="play-again-btn" onClick={() => {
                                setWinnerMessage(null);

                                //show match customization screen
                                setIsConfiguring(true);

                                //reset match
                                setMatchData({
                                    size: 10,
                                    style: 'neon',
                                    markerIndex: 0,
                                    startTime: null,
                                    boardState: [],
                                    moveHistory: []
                                });
                            }}>
                                Play Again
                            </button>
                            
                            <button className="exit-btn" onClick={() => {
                                //go to landing page
                                navigate('/');
                            }}>
                                Main Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}