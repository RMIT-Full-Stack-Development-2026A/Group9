import React from 'react';
import ReplayBoard from './ReplayBoard.jsx';
import ReplayControls from './ReplayControls.jsx';
import styles from './ReplayModal.module.css';

/*
  ReplayModal
  - Modal UI that displays a match replay using `ReplayBoard` and
    playback controls from `ReplayControls`.
  - Props:
    - `open` boolean to show/hide modal
    - `session` metadata (boardSize, timestamps)
    - `moves` array of move objects with { notation, marker }
    - `replayIndex` current step index (0 = before first move)
    - `replayPlaying` boolean playback state
    - control callbacks for jump/step/toggle
*/
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

  // Default board size when session doesn't include it
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
