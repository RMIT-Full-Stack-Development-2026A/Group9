
import React from 'react';
import Cell from '../Cell/Cell';
import styles from './GameBoard.module.css';

export default function GameBoard({ size, styleType, markerIndex, boardState, onCellClick, winningLine, isLocked }) {
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
            {(boardState || []).map((cellValue, index) => (
                <Cell
                    key={index}
                    value={cellValue}
                    markerIndex={markerIndex}
                    onClick={() => onCellClick(index)}
                    className={styles['game-cell']}
                    isWinningCell={Array.isArray(winningLine) && winningLine.includes(index)}
                    isLocked={isLocked}
                />
            ))}
        </div>
    );
}