/**
 * ============================================================================
 * GAME STATUS COMPONENT (The Match Info Bar)
 * ============================================================================
 * Location: src/modules/game/components/GameStatus.jsx
 * Purpose: This component provides the real-time context of the match. It 
 * tells the player whose turn it is, if they won, or if the match is a draw.
 * * Key Responsibilities:
 * 1. Turn Indication: Highlighting the active player (X or O).
 * 2. Result Messaging: Displaying "You Win!", "You Lose!", or "Draw!".
 * 3. Player Identity: Showing usernames and avatars next to their symbols.
 * 4. Match State: Displaying 'Waiting for opponent' during matchmaking.
 */

import React from 'react';
import '../GameStatus/GameStatus.module.css';

export default function GameStatus({ markerIndex }) { 
    return (
        <div className="game-status-bar">
            {/*player1 badge*/}
            <div className="player-badge active-turn">
                <div className="avatar p1-avatar"></div>
                <div className="player-info">
                    <span className="name">Player 1</span>
                    <span className="status">Your Turn</span>
                </div>
            </div>

            <div className="vs-circle">VS</div>

            {/*player2 bade*/}
            <div className="player-badge waiting">
                <div className="avatar p2-avatar"></div>
                <div className="player-info">
                    <span className="name">Waiting...</span>
                    <span className="status">Opponent</span>
                </div>
            </div>
        </div>
    );
}