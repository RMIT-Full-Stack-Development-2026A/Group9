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
import './Cell.module.css';

//diff markers as per requirement, can be changed
const MARKER_THEMES = {
    0: { X: 'X', O: 'O' },
    1: { X: '👻', O: '💀' },
    2: { X: '🔥', O: '💧' },
    3: { X: '⚡', O: '❄️' },
    4: { X: '💎', O: '💍' },
    5: { X: '❤️', O: '💔' }
};

export default function Cell({ value, markerIndex = 0, onClick }) {
    const theme = MARKER_THEMES[markerIndex] || MARKER_THEMES[0];
    const content = value === 'X' ? theme.X : value === 'O' ? theme.O : null;

    return (
        <button className="game-cell" onClick={onClick} disabled={!!value}>
            <span className="marker-text">{content}</span>
        </button>
    );
}