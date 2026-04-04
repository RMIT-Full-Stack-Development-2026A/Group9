/**
 * Easy AI (Req 4.2.3):
 * Randomly chooses an empty cell immediately adjacent to the player's last move.
 */
export const getEasyMove = (board, lastMove) => {
  const size = board.length;

  if (!lastMove) {
    // First move: pick center-ish
    const center = Math.floor(size / 2);
    if (board[center][center] === null) return { row: center, col: center };
  }

  const { row, col } = lastMove;
  const adjacent = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === null) {
        adjacent.push({ row: nr, col: nc });
      }
    }
  }

  if (adjacent.length > 0) {
    return adjacent[Math.floor(Math.random() * adjacent.length)];
  }

  // Fallback: pick any empty cell
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === null) return { row: r, col: c };
    }
  }

  return null; // Board is full
};
