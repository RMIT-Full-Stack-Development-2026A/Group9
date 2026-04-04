import { analyzeLine, getRelevantCells } from "../engine/gameEngine.js";

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

/**
 * Hard AI (Req 4.2.5):
 * Performs all defensive actions from Medium AI (blocks 5-line, open 4-line, forks)
 * AND attacks by completing its own 5-mark line when opportunity exists.
 */
export const getHardMove = (board, aiMarker, playerMarker, lastMove) => {
  const size = board.length;
  const candidates = getRelevantCells(board, 2);

  if (candidates.length === 0) {
    const center = Math.floor(size / 2);
    if (board[center][center] === null) return { row: center, col: center };
    return null;
  }

  // === ATTACK: complete own 5-mark line ===
  for (const [r, c] of candidates) {
    for (const [dr, dc] of DIRECTIONS) {
      board[r][c] = aiMarker;
      const line = analyzeLine(board, r, c, dr, dc, aiMarker);
      board[r][c] = null;
      if (line.length >= 5) {
        return { row: r, col: c };
      }
    }
  }

  // === DEFEND: block opponent 5-mark line ===
  for (const [r, c] of candidates) {
    for (const [dr, dc] of DIRECTIONS) {
      board[r][c] = playerMarker;
      const line = analyzeLine(board, r, c, dr, dc, playerMarker);
      board[r][c] = null;
      if (line.length >= 5) {
        return { row: r, col: c };
      }
    }
  }

  // === ATTACK: create open 4-mark line ===
  for (const [r, c] of candidates) {
    for (const [dr, dc] of DIRECTIONS) {
      board[r][c] = aiMarker;
      const line = analyzeLine(board, r, c, dr, dc, aiMarker);
      board[r][c] = null;
      if (line.length >= 4 && line.openEnds >= 2) {
        return { row: r, col: c };
      }
    }
  }

  // === DEFEND: block opponent open 4-mark line ===
  for (const [r, c] of candidates) {
    for (const [dr, dc] of DIRECTIONS) {
      board[r][c] = playerMarker;
      const line = analyzeLine(board, r, c, dr, dc, playerMarker);
      board[r][c] = null;
      if (line.length >= 4 && line.openEnds >= 2) {
        return { row: r, col: c };
      }
    }
  }

  // === ATTACK: create fork (two open 3-mark lines) ===
  for (const [r, c] of candidates) {
    let openThreeCount = 0;
    for (const [dr, dc] of DIRECTIONS) {
      board[r][c] = aiMarker;
      const line = analyzeLine(board, r, c, dr, dc, aiMarker);
      board[r][c] = null;
      if (line.length >= 3 && line.openEnds >= 2) {
        openThreeCount++;
      }
    }
    if (openThreeCount >= 2) {
      return { row: r, col: c };
    }
  }

  // === DEFEND: block opponent fork ===
  for (const [r, c] of candidates) {
    let openThreeCount = 0;
    for (const [dr, dc] of DIRECTIONS) {
      board[r][c] = playerMarker;
      const line = analyzeLine(board, r, c, dr, dc, playerMarker);
      board[r][c] = null;
      if (line.length >= 3 && line.openEnds >= 2) {
        openThreeCount++;
      }
    }
    if (openThreeCount >= 2) {
      return { row: r, col: c };
    }
  }

  // === ATTACK: build own open 3-mark line ===
  for (const [r, c] of candidates) {
    for (const [dr, dc] of DIRECTIONS) {
      board[r][c] = aiMarker;
      const line = analyzeLine(board, r, c, dr, dc, aiMarker);
      board[r][c] = null;
      if (line.length >= 3 && line.openEnds >= 2) {
        return { row: r, col: c };
      }
    }
  }

  // Fallback: score candidates by proximity to center and existing marks
  let bestScore = -Infinity;
  let bestMove = candidates[0];

  for (const [r, c] of candidates) {
    let score = 0;
    // Prefer center
    const centerDist = Math.abs(r - size / 2) + Math.abs(c - size / 2);
    score -= centerDist;

    // Prefer cells adjacent to own marks
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (board[nr][nc] === aiMarker) score += 2;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return { row: bestMove[0], col: bestMove[1] };
};
