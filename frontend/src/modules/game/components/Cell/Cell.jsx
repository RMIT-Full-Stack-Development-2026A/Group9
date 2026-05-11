import React from 'react';
import styles from './Cell.module.css';

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