import React, { useMemo } from 'react';
import styles from './ReplayModal.module.css';

// Convert algebraic notation (e.g., "c2") back to row/col coordinates
function fromAlgebraicNotation(notation, boardSize) {
  if (!notation || typeof notation !== 'string' || notation.length < 2) return null;

  const notationLower = notation.toLowerCase();
  const fileChar = notationLower[0];
  const rankStr = notationLower.slice(1);

  // Convert file (letter) to column (0-indexed)
  let col = 0;
  for (let i = 0; i < fileChar.length; i++) {
    col = col * 26 + (fileChar.charCodeAt(i) - 'a'.charCodeAt(0) + 1);
  }
  col -= 1; // Convert to 0-indexed

  // Parse rank string to number
  const rank = parseInt(rankStr, 10);
  if (!Number.isInteger(rank) || rank < 1 || rank > boardSize) return null;

  // Convert rank to row: rank = boardSize - row, so row = boardSize - rank
  const row = boardSize - rank;

  // Validate coordinates
  if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return null;

  return { row, col };
}

export default function ReplayBoard({ boardSize, moves, replayIndex }) {
  const isLargeBoard = boardSize >= 15;

  const { cells: board, winningLine } = useMemo(() => {
    const cells = Array(boardSize * boardSize).fill(null);
    for (let i = 0; i < replayIndex; i += 1) {
      const move = moves[i];
      if (!move || !move.notation) continue;

      // Reconstruct position from algebraic notation
      const pos = fromAlgebraicNotation(move.notation, boardSize);
      if (!pos) continue;

      const { row, col } = pos;
      cells[row * boardSize + col] = move.marker;
    }

    // local checkWinLine implementation (mirrors backend)
    function checkWinLine(localBoard, size, marker) {
      if (!marker) return null;
      const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const idx = row * size + col;
          if (localBoard[idx] !== marker) continue;
          for (const [dr, dc] of directions) {
            const winLine = [idx];
            let r = row, c = col;
            for (let k = 1; k < 5; k++) {
              r += dr; c += dc;
              if (r < 0 || r >= size || c < 0 || c >= size) break;
              const nextIdx = r * size + c;
              if (localBoard[nextIdx] === marker) {
                winLine.push(nextIdx);
              } else {
                break;
              }
            }
            if (winLine.length === 5) return winLine;
          }
        }
      }
      return null;
    }

    // Determine winning line based on last applied move marker (if any)
    let win = null;
    if (replayIndex > 0 && moves[replayIndex - 1]) {
      const lastMarker = moves[replayIndex - 1].marker;
      win = checkWinLine(cells, boardSize, lastMarker);
    }

    return { cells, winningLine: win };
  }, [boardSize, moves, replayIndex]);

  const axisLetters = useMemo(() => {
    return Array.from({ length: boardSize }, (_, i) => String.fromCharCode(97 + i));
  }, [boardSize]);

  return (
    <div className={`${styles.replayBoardWrap} ${isLargeBoard ? styles.replayBoardWrapLarge : ''}`}>
      <div
        className={`${styles.replayXAxis} ${isLargeBoard ? styles.replayXAxisCompact : ''}`}
        style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
      >
        {axisLetters.map((letter) => (
          <span key={letter}>{letter}</span>
        ))}
      </div>

      <div className={styles.replayGridAndYAxis}>
        <div
          className={`${styles.replayYAxis} ${isLargeBoard ? styles.replayYAxisCompact : ''}`}
          style={{ gridTemplateRows: `repeat(${boardSize}, 1fr)` }}
        >
          {Array.from({ length: boardSize }, (_, row) => (
            <span key={`y-${row}`}>{boardSize - row}</span>
          ))}
        </div>

        <div className={styles.replayGrid} style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}>
          {board.map((cell, idx) => {
            const isWin = Array.isArray(winningLine) && winningLine.includes(idx);
            return (
              <div
                key={`cell-${idx}`}
                className={`${styles.replayCell} ${isLargeBoard ? styles.replayCellCompact : ''} ${isWin ? styles.replayWinningCell : ''}`}
              >
                {cell || ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
