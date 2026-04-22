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

import React from "react";
import { useParams } from "react-router-dom";
import GameBoard from "../components/GameBoard/GameBoard.jsx";
import ChatBox from "../components/ChatBox/Board.jsx";
import GameStatus from "../components/GameStatus/GameStatus.jsx";
import { useMultiplayer } from "../hooks/useMultiplayer.js";
import { useChat } from "../hooks/useChat.js";

export default function GameArena() {
    const { gameId } = useParams();
    const token = localStorage.getItem("token");
    const roomId = gameId || "";
	

    // Real-time Game Logic (Requirement 4.3.1)
    const { 
        board, 
        makeMove, 
        error, 
        opponentJoined, 
        gameStarted, 
        playerMark, 
        chooseMark 
    } = useMultiplayer(roomId, token);
    
    // Real-time Chat Logic (Requirement 4.3.2)
    const { 
        messages, 
        sendMessage, 
        chatError 
    } = useChat(roomId, token);

	if (!gameId) {
		return <div className="error-page">Missing game room id.</div>;
	}

    if (error === "Room is full") {
        return <div className="error-page">This arena is full! Only 2 players allowed.</div>;
    }

    return (
        <div className="arena-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '20px', alignItems: 'start' }}>
            <div className="game-section" style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '20px', padding: '20px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)' }}>
                {/* Status component can now display what mark the user is playing as */}
                <GameStatus 
                    opponentJoined={opponentJoined} 
                    gameStarted={gameStarted}
                    playerMark={playerMark}
                />
                
                {/* Condition 1: Waiting for opponent */}
                {!opponentJoined && (
                    <div className="waiting-screen">
                        <h2>Waiting for Player 2 to join...</h2>
                    </div>
                )}

                {/* Condition 2: Opponent joined, waiting for Mark selection */}
                {opponentJoined && !gameStarted && (
                    <div className="mark-selection" style={{ textAlign: 'center', padding: '2rem' }}>
                        <h3>Choose your mark to begin!</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <button 
                                onClick={() => chooseMark('X')}
                                style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                Play as X
                            </button>
                            <button 
                                onClick={() => chooseMark('O')}
                                style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                Play as O
                            </button>
                        </div>
                    </div>
                )}

                {/* Condition 3: Game Started! Show the board */}
                {gameStarted && (
                    <GameBoard 
                        board={board} 
                        onCellClick={(index) => makeMove(index)} 
                    />
                )}
            </div>

            <div className="chat-sidebar" style={{ position: 'sticky', top: '20px' }}>
                <ChatBox 
                    messages={messages} 
                    onSendMessage={sendMessage} 
                    error={chatError}
                />
            </div>
        </div>
    );
}
