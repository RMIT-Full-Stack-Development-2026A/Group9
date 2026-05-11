import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import styles from './GameModals.module.css';

function runEndEffect(type, setAnimateCrack) {
    if (type === 'draw') {
        const durationMs = 2000;
        const intervalMs = 100;
        const endTime = Date.now() + durationMs;
        const intervalId = setInterval(() => {
            confetti({
                particleCount: 2,
                startVelocity: 0,
                ticks: 200,
                gravity: 0.5,
                origin: { x: Math.random(), y: 0 },
                colors: ['#ffffff', '#94a3b8', '#e0f2fe'],
                scalar: 0.7,
                zIndex: 1100,
            });
            if (Date.now() >= endTime) {
                clearInterval(intervalId);
            }
        }, intervalMs);

        return () => clearInterval(intervalId);
    }

    if (type === 'defeat') {
        setAnimateCrack(true);
        const crackTimeout = setTimeout(() => setAnimateCrack(false), 1200);
        return () => clearTimeout(crackTimeout);
    }

    confetti({
        particleCount: 150,
        spread: 70,
        colors: ['#06b6d4', '#22c55e'],
        zIndex: 1100,
    });

    return undefined;
}

export default function EndGameModal({ resultName, player1, player2, onPlayAgain, onExit, isOfflineMatch = false }) {
    if (!resultName) return null;

    const isDraw = resultName === 'Draw';
    // Determine if Player 1 (the main user) won
    const isWin = resultName === player1?.name;
    // Determine if it's a defeat (Only possible in non-local games where P1 didn't win and it's not a draw)
    const isDefeat = !isOfflineMatch && !isWin && !isDraw;

    const [animateCrack, setAnimateCrack] = useState(false);

    useEffect(() => runEndEffect(isDraw ? 'draw' : isDefeat ? 'defeat' : 'win', setAnimateCrack), [isDraw, isDefeat]);

    // Determine the dynamic theme class
    const themeClass = isDraw ? styles.drawTheme : isDefeat ? styles.defeatTheme : styles.victoryTheme;

    const cardClass = `${styles.victoryCard} ${themeClass} ${isDefeat && animateCrack ? styles.crackAnimation : ''}`;

    return (
        <div className={styles.victoryOverlay}>
            <div className={cardClass}>
                {/* defeat particles removed — defeat uses canvas-confetti like win/draw */}
                {isDefeat && animateCrack && (
                    <div className={styles.crackOverlay} aria-hidden="true">
                        <svg width="100%" height="100%" viewBox="0 0 420 420" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M210 40 L200 120 L240 150 L180 190 L220 230 L200 300" opacity="0.95" />
                                <path d="M210 60 L260 110 L300 130" opacity="0.8" />
                                <path d="M210 80 L160 130 L140 170" opacity="0.7" />
                            </g>
                        </svg>
                    </div>
                )}
                
                {/* Top Icon: Trophy for Win/Local, Handshake for Draw, Broken Heart/Frown for Defeat */}
                <div className={styles.trophyWrapper}>
                    <div className={`${styles.trophyIcon} ${isDraw ? styles.drawIcon : isDefeat ? styles.defeatIcon : styles.victoryIcon}`}>
                        {isDraw ? (
                            <img src="/hand-shake.png" alt="Draw" />
                        ) : (
                            <i className={`bi ${isDefeat ? 'bi-emoji-frown' : 'bi-trophy'}`}></i>
                        )}
                    </div>
                </div>

                {/* Main Title Logic */}
                <h1 className={styles.victoryTitle}>
                    {isDraw ? "Draw!" : isDefeat ? "Defeat" : "Victory!"}
                </h1>
                
                {/* Subtitle Logic */}
                <h2 className={styles.winnerSubtitle}>
                    {isDraw ? "It's a Tie!" 
                        : isOfflineMatch ? `${resultName} Wins!` 
                        : isWin ? "You Win!" 
                        : `${resultName} Wins!`}
                </h2>
                
                <p className={styles.congratsText}>
                    {isDraw ? "Both players showed equal skill and strategy!" 
                        : isDefeat ? "Better luck next time. Keep practicing!" 
                        : "Congratulations on your strategic triumph!"}
                </p>

                {/* Scoreboard Summary Box */}
                <div className={styles.scoreBoard}>
                    <div className={styles.playerInfo}>
                        <span className={styles.playerLabel}>{player1?.name || "You"}</span>
                        <div className={styles.markerArea}>
                            {player1?.marker} 
                            {!isDraw && isWin && (
                                <i className="bi bi-trophy-fill" style={{color: '#f97316', marginLeft: '8px', fontSize: '1rem'}}></i>
                            )}
                        </div>
                    </div>
                    <div className={styles.playerInfo}>
                        <span className={styles.playerLabel}>{player2?.name || "Opponent"}</span>
                        <div className={styles.markerArea}>
                            {player2?.marker} 
							{!isDraw && resultName === player2?.name && (
                                <i className="bi bi-trophy-fill" style={{color: '#f97316', marginLeft: '8px', fontSize: '1rem'}}></i>
                            )}
                        </div>
                    </div>
                </div>

                {/* Extra Box specifically for Draw State */}
                {isDraw && (
                    <div className={styles.matchNoteBox}>
                        <strong>Perfectly Matched:</strong> When two masters meet, sometimes neither can claim victory.
                    </div>
                )}

                {isDefeat && (
                    <div className={styles.defeatQuoteBox}>
                        <p className={styles.defeatQuote}>
                            “The master has failed more times than the beginner has even tried.”
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className={styles.victoryActions}>
                    <button className={styles.playAgainBtn} onClick={onPlayAgain}>
                        <i className="bi bi-arrow-clockwise"></i> Play Again
                    </button>
                    <button className={styles.goHomeBtn} onClick={onExit}>
                        <i className="bi bi-house"></i> Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}