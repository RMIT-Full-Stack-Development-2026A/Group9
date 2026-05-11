import React from 'react';
import styles from './GameControl.module.css';

export default function GameControl({ onAbort }) {
    return (
        <div className={styles['game-control']}>
            <button className={styles['abort-btn']} onClick={onAbort}>
                Abort Match
            </button>
        </div>
    );
}
