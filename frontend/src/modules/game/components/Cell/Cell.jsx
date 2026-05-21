import React from 'react';
import styles from './Cell.module.css';

/*
    Cell
    - Small, focused component representing a single board cell.
    - Responsibilities:
        * Render the marker if `value` exists.
        * Disable clicks when the cell is occupied or when the board is locked.
        * Apply `isWinningCell` styling for visual emphasis on the winning line.
*/
export default function Cell({ value, onClick, className, isWinningCell, isLocked }) {
    const isDisabled = !!value || isLocked;

    return (
        <button 
            //combine cell module styles with ones passed from gameboard
            className={`${styles['game-cell'] || ''} ${isWinningCell ? styles['winning-cell'] : ''} ${className || ''}`} 
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}
        >
            {value && (
                <span className={styles['marker-text']}>
                    {value}
                </span>
            )}
        </button>
    );
}