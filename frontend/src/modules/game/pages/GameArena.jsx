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
    const token = localStorage.getItem("token"); // Or however you store your JWT
	

    // Real-time Game Logic (Requirement 4.3.1)
    const { board, makeMove, error, opponentJoined, gameStarted, playerMark, chooseMark } = useMultiplayer(gameId, token);
    
    // Real-time Chat Logic (Requirement 4.3.2)
    const { messages, sendMessage, chatError } = useChat(gameId, token);

    if (error === "Room is full") {
        return <div className="error-page">This arena is full! Only 2 players allowed.</div>;
    }

    return (
        <div className="arena-container" style={{ display: 'flex', gap: '20px' }}>
        	<div className="game-section">
            	<GameStatus opponentJoined={opponentJoined} />
            
            {/* Condition 1: Waiting for opponent */}
            {!opponentJoined && <div>Waiting for Player 2 to join...</div>}

            {/* Condition 2: Opponent joined, waiting for Mark selection */}
            {opponentJoined && !gameStarted && (
                <div className="mark-selection">
                    <h3>Choose your mark to start!</h3>
                    <button onClick={() => chooseMark('X')}>Play as X</button>
                    <button onClick={() => chooseMark('O')}>Play as O</button>
                </div>
            )}

            {/* Condition 3: Game Started! */}
            {gameStarted && (
                 <GameBoard 
                 board={board} 
                 // Pass the actual selected mark instead of hardcoding "X"
                 onCellClick={(index) => makeMove(index, playerMark)} 
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
