import React, { useEffect, useState } from 'react';
import GameStatus from '../GameStatus/GameStatus';
import EndGameModal from '../GameModals/EndGameModal';
import { buildMatchDisplayData } from '../../services/game.service.js';
import styles from "./ArenaView.module.css";

export default function ArenaView({
    matchData,
    xIsNext,
    resultName,
    isLocked,
    onCellClick,
    onAbort,
    onPlayAgain,
    onExit,
    sidebarChildren,
    outcome,
}) {
    const [showEndGameModal, setShowEndGameModal] = useState(false);
    const [copyStatus, setCopyStatus] = useState('Copy');

    useEffect(() => {
        if (!resultName) {
            setShowEndGameModal(false);
            return undefined;
        }
        const timer = setTimeout(() => setShowEndGameModal(true), 700);
        return () => clearTimeout(timer);
    }, [resultName]);

    const handleCopyRoomId = async () => {
        const roomText = matchDisplay.roomLabel;
        if (!roomText) return;
        try {
            await navigator.clipboard.writeText(roomText);
            setCopyStatus('Copied');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        } catch (error) {
            setCopyStatus('Copy');
        }
    };

    const { 
        size, 
        style, 
        p1Marker, 
        p2Marker,
        player1Name,
        player2Name,
        player1Avatar,
        player2Avatar,
        winningLine,
        isOfflineMatch,
        gameType
    } = matchData;

    const matchDisplay = buildMatchDisplayData(matchData);

    return (
        <div className={`${styles['arena-page']} ${styles[`${style}-theme`]}`}>
            <div className={styles['arena-content']}>
                <GameStatus
                    matchData={matchData}
                    matchDisplay={matchDisplay}
                    xIsNext={xIsNext}
                    onCellClick={onCellClick}
                    onAbort={onAbort}
                    isLocked={isLocked}
                />

                {/* Sidebar: Details and Chat */}
                <aside className={styles['arena-sidebar']}>
                    <div className={styles['sidebar-panel']}>
                        <h3>Match Details</h3>

                        <div className={styles['detail-row']}>
                            <span className={styles['detail-icon']}>🎯</span>
                            <span className={styles['detail-label']}>Board:</span>
                            <span className={styles['detail-value']}>{size}×{size}</span>
                        </div>

                        <div className={styles['detail-row']}>
                            <span className={styles['detail-icon']}>🎮</span>
                            <span className={styles['detail-label']}>Type:</span>
                            <span className={styles['detail-value']}>{matchDisplay.gameTypeLabel}</span>
                        </div>

                        <div className={styles['detail-row']}>
                            <span className={styles['detail-icon']}>🔑</span>
                            <span className={styles['detail-label']}>Room:</span>
                            <button
                                type="button"
                                className={`${styles['detail-value']} ${styles['room-link']}`}
                                onClick={handleCopyRoomId}
                                title="Click to copy room ID"
                            >
                                {matchDisplay.roomLabel}
                                <span className={styles['copy-badge']}>
                                    {copyStatus}
                                </span>
                            </button>
                        </div>
                    </div>
                    {sidebarChildren}
                </aside>
            </div>

            {showEndGameModal && (
                <EndGameModal
                    resultName={resultName}
                    player1={{ name: player1Name, marker: p1Marker }}
                    player2={{ name: player2Name, marker: p2Marker }}
                    isOfflineMatch={matchDisplay.isOfflineMatch}
                    gameType={gameType}
                    outcome={outcome}
                    onPlayAgain={onPlayAgain}
                    onExit={onExit}
                />
            )}
        </div>
    );
}