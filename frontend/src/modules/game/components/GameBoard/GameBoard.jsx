/**
 * ============================================================================
 * GAME BOARD COMPONENT (The Grid)
 * ============================================================================
 * Location: src/modules/game/components/GameBoard.jsx
 * Purpose: This is the visual representation of the TicTacToang match. It 
 * renders a 10x10 (or 15x15) grid and handles the "Click" events for player moves.
 * * Key Responsibilities:
 * 1. Grid Rendering: Mapping a simple array of 9 values into a CSS Grid.
 * 2. Interaction: Capturing which index (0-8) the player clicked.
 * 3. Visual Feedback: Displaying "X", "O", or an empty space with animations.
 * 4. State Sync: Reflecting the 'board' state received from the backend.
 */

import React from 'react';
import Cell from '../Cell/Cell';
import styles from './GameBoard.module.css';

export default function GameBoard({ size, styleType, markerIndex, boardState, onCellClick }) {
    //supports both 10x10 and 15x15
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        width: '100%',
        height: '100%',
        gap: '1px',
        background: '#242f4d',
        border: '2px solid #242f4d',
    };

    return (
        <div className={`game-board ${styleType}-theme`} style={gridStyle}>
            {boardState.map((cellValue, index) => (
                <Cell 
                    key={index} 
                    value={cellValue}
                    markerIndex={markerIndex}
                    onClick={() => onCellClick(index)}
                />
            ))}
        </div>
    );
}