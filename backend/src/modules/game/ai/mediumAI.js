import { analyzeLine, getRelevantCells } from "../engine/gameEngine.js";

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

/**
 * Medium AI (Req 4.2.4):
 * Blocks the player from completing:
 * 1) Any 5-mark line
 * 2) Any 4-mark line opened on both ends
 * 3) Any fork formation (two crossing 3-mark lines each opened on both ends)
 */
export const getMediumMove = (board, aiMarker, playerMarker, lastMove) => {
  const size = board.length;
  const candidates = getRelevantCells(board, 2);

  if (candidates.length === 0) {
    const center = Math.floor(size / 2);
    if (board[center][center] === null) return { row: center, col: center };
    return null;
  }

  // 1) Block any 5-mark line: if opponent has 4 in a row and can complete 5
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

  // 2) Block any 4-mark line opened on both ends
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

  // 3) Block fork: two crossing 3-mark open-ended lines
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

  // No threat found — pick a random relevant cell
  const randomIdx = Math.floor(Math.random() * candidates.length);
  return { row: candidates[randomIdx][0], col: candidates[randomIdx][1] };
};
