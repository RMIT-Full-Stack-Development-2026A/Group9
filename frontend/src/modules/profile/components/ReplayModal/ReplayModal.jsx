import React from 'react';
import ReplayBoard from './ReplayBoard.jsx';
import ReplayControls from './ReplayControls.jsx';
import styles from './ReplayModal.module.css';

export default function ReplayModal({
  open,
  session,
  moves,
  replayIndex,
  replayPlaying,
  onClose,
  onJumpStart,
  onStepBack,
  onTogglePlay,
  onStepForward,
  onJumpEnd,
}) {
  if (!open) return null;

  const boardSize = session?.boardSize || 10;
  const currentMove = replayIndex > 0 ? moves[replayIndex - 1] : null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}><span className={styles.playIcon}>▶</span> Match Replay</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.metaRow}>
          <p className={styles.moveMeta}>Move {replayIndex} / {moves.length}</p>
          <span className={styles.notationBadge}>{currentMove?.notation || '--'}</span>
        </div>

        <div className={styles.boardViewport}>
          <ReplayBoard boardSize={boardSize} moves={moves} replayIndex={replayIndex} />
        </div>

        <ReplayControls
          onJumpStart={onJumpStart}
          onStepBack={onStepBack}
          onTogglePlay={onTogglePlay}
          onStepForward={onStepForward}
          onJumpEnd={onJumpEnd}
          replayPlaying={replayPlaying}
        />
      </div>
    </div>
  );
}
