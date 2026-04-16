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
import GameBoard from "../modules/game/components/GameBoard/GameBoard";
import ChatBox from "../modules/game/components/ChatBox/Board"; // Your ChatBox container
import GameStatus from "../modules/game/components/GameStatus/GameStatus";
import { useMultiplayer } from "../modules/game/hooks/useMultiplayer";
import { useChat } from "../modules/game/hooks/useChat";

export default function GameArena() {
    const { gameId } = useParams();
    const token = localStorage.getItem("token");
	

    // Real-time Game Logic (Requirement 4.3.1)
    const { 
        board, 
        makeMove, 
        error, 
        opponentJoined, 
        gameStarted, 
        playerMark, 
        chooseMark 
    } = useMultiplayer(gameId, token);
    
    // Real-time Chat Logic (Requirement 4.3.2)
    const { 
        messages, 
        sendMessage, 
        chatError 
    } = useChat(gameId, token);

    if (error === "Room is full") {
        return <div className="error-page">This arena is full! Only 2 players allowed.</div>;
    }

    return (
        <div className="arena-container" style={{ display: 'flex', gap: '20px' }}>
            <div className="game-section">
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

            <div className="chat-sidebar">
                <ChatBox 
                    messages={messages} 
                    onSendMessage={sendMessage} 
                    error={chatError}
                />
            </div>
        </div>
    );
}
