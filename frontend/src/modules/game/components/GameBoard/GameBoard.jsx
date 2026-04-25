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
        maxWidth: '500px',
        aspectRatio: '1 / 1',
        margin: '0 auto',
        gap: '1px',
    };

    //look for selected theme style in the module.css file
    const boardClass = `${styles['game-board']} ${styles[`${styleType}-style`] || ''}`;

    return (
        <div className={boardClass} style={gridStyle}>
            {boardState.map((cellValue, index) => (
                <Cell 
                    key={index} 
                    value={cellValue}
                    markerIndex={markerIndex}
                    onClick={() => onCellClick(index)}
                    className={styles['game-cell']} 
                />
            ))}
        </div>
    );
}