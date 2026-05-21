import React from 'react';
import styles from './ReplayModal.module.css';

// ReplayControls: simple playback UI used by `ReplayModal`.
// All buttons are pure callbacks provided by the parent hook.
export default function ReplayControls({
  onJumpStart,
  onStepBack,
  onTogglePlay,
  onStepForward,
  onJumpEnd,
  replayPlaying,
}) {
  return (
    <div className={styles.replayControls}>
      <button type="button" className={styles.ctrlBtn} onClick={onJumpStart} title="First move">«</button>
      <button type="button" className={styles.ctrlBtn} onClick={onStepBack} title="Previous move">|‹</button>
      <button type="button" className={`${styles.ctrlBtn} ${styles.ctrlPrimary}`} onClick={onTogglePlay} title={replayPlaying ? 'Pause' : 'Resume'}>
        {replayPlaying ? '❚❚' : '▶'}
      </button>
      <button type="button" className={styles.ctrlBtn} onClick={onStepForward} title="Next move">›|</button>
      <button type="button" className={styles.ctrlBtn} onClick={onJumpEnd} title="Last move">»</button>
    </div>
  );
}
