import React from 'react';
import GameBoard from '../GameBoard/GameBoard';
import GameControl from '../GameControl/GameControl';
import styles from './GameStatus.module.css';

export default function GameStatus({
    matchData,
    matchDisplay,
    xIsNext,
    onCellClick,
    onAbort,
    isLocked,
}) {
    const {
        size,
        style,
        markerIndex,
        boardState,
        p1Marker,
        p2Marker,
        player1Name,
        player2Name,
        player1Avatar,
        player2Avatar,
        winningLine,
    } = matchData;

    const {
        isOfflineMatch = false,
        player1BadgeLabel = 'P1',
        player2BadgeLabel = 'P2',
    } = matchDisplay || {};

    return (
        <main className={styles['match-stage']}>
            <div className={styles['player-dashboard']}>
                <div className={`${styles['player-card']} ${xIsNext ? styles['active-turn'] : ''}`}>
                    <div className={styles['player-avatar']}>
                        {isOfflineMatch ? (
                            <span>{player1BadgeLabel}</span>
                        ) : player1Avatar ? (
                            <img src={player1Avatar} alt={player1Name || 'Player 1'} />
                        ) : (
                            <span>{player1BadgeLabel}</span>
                        )}
                    </div>
                    <div className={styles['player-info']}>
                        <div className={styles['player-name']}>{player1Name || 'Player 1'}</div>
                        <div className={styles['player-marker']}>{p1Marker || 'X'}</div>
                    </div>
                </div>

                <div className={styles['vs-badge']}>VS</div>

                <div className={`${styles['player-card']} ${!xIsNext ? styles['active-turn'] : ''}`}>
                    <div className={styles['player-info']}>
                        <div className={styles['player-name']}>{player2Name || 'Player 2'}</div>
                        <div className={styles['player-marker']}>{p2Marker || 'O'}</div>
                    </div>
                    <div className={styles['player-avatar']}>
                        {isOfflineMatch ? (
                            <span>{player2BadgeLabel}</span>
                        ) : player2Avatar ? (
                            <img src={player2Avatar} alt={player2Name || 'Player 2'} />
                        ) : (
                            <span>{player2BadgeLabel}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles['board-wrapper']}>
                <GameBoard
                    size={size}
                    styleType={style}
                    markerIndex={markerIndex}
                    boardState={boardState}
                    onCellClick={onCellClick}
                    winningLine={winningLine}
                    isLocked={isLocked}
                />
            </div>

            <GameControl onAbort={onAbort} />
        </main>
    );
}