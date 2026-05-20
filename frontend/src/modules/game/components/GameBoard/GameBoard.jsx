
import React, { useMemo } from 'react';
import Cell from '../Cell/Cell';
import styles from './GameBoard.module.css';

export default function GameBoard({ size, styleType, markerIndex, boardState, onCellClick, winningLine, isLocked }) {
    // Generate axis labels for algebraic notation
    const axisLetters = useMemo(() => {
        return Array.from({ length: size }, (_, i) => String.fromCharCode(97 + i));
    }, [size]);

    const axisNumbers = useMemo(() => {
        return Array.from({ length: size }, (_, i) => size - i);
    }, [size]);

    //look for selected theme style in the module.css file
    const boardClass = `${styles['game-board']} ${styles[`${styleType}-style`] || ''}`;

    return (
        <div className={styles['boardContainer']}>
            {/* Top axis labels (a-j or a-o) */}
            <div className={`${styles['xAxis']} ${styles[`xAxis-${styleType}`] || ''}`} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                {axisLetters.map((letter) => (
                    <span key={`x-${letter}`}>{letter}</span>
                ))}
            </div>

            {/* Main board with side axis labels */}
            <div className={styles['gridAndYAxis']}>
                {/* Left axis labels (1-10 or 1-15) */}
                <div className={`${styles['yAxis']} ${styles[`yAxis-${styleType}`] || ''}`} style={{ gridTemplateRows: `repeat(${size}, 1fr)` }}>
                    {axisNumbers.map((num) => (
                        <span key={`y-${num}`}>{num}</span>
                    ))}
                </div>

                {/* Game grid */}
                <div className={boardClass} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                    {(boardState || []).map((cellValue, index) => (
                        <Cell
                            key={index}
                            value={cellValue}
                            markerIndex={markerIndex}
                            onClick={() => onCellClick(index)}
                            className={`${styles['game-cell']} ${styles[`${styleType}-style`] || ''}`}
                            isWinningCell={Array.isArray(winningLine) && winningLine.includes(index)}
                            isLocked={isLocked}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}