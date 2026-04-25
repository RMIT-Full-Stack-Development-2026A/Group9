/**
 * ============================================================================
 * CELL COMPONENT (The Interactive Square)
 * ============================================================================
 * Location: src/modules/game/components/Cell.jsx
 * Purpose: This is the smallest unit of the TicTacToang board. While 
 * GameBoard.jsx manages the 10x10 layout, this component focuses on the 
 * individual behavior, animations, and sound effects of a single square.
 * * Key Responsibilities:
 * 1. Semantic Markup: Using buttons for accessibility (keyboard navigation).
 * 2. Visual State: Handling 'X', 'O', or 'Empty' rendering.
 * 3. Event Bubbling: Passing clicks back up to the GameBoard.
 * 4. Conditional Styling: Highlighting if the cell is part of a winning line.
 */

import React from 'react';
import styles from './Cell.module.css';

export default function Cell({ value, onClick, className }) {
    return (
        <button 
            //combine cell module styles with ones passed from gameboard
            className={`${styles['game-cell'] || ''} ${className || ''}`} 
            onClick={onClick}
            disabled={!!value}
        >
            {value && (
                <span className={styles['marker-text']}>
                    {value}
                </span>
            )}
        </button>
    );
}