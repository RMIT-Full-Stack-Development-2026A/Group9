import React from 'react';
import styles from './GameControl.module.css';

// Small control bar rendered alongside the board. Kept intentionally
// minimal — only exposes the `onAbort` callback which the parent page
// wires to `useGame.abortCurrentSession`.
export default function GameControl({ onAbort }) {
    return (
        <div className={styles['game-control']}>
            <button className={styles['abort-btn']} onClick={onAbort}>
                Abort Match
            </button>
        </div>
    );
}
