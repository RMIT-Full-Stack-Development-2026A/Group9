import { WIN_LENGTH } from "../../shared/constants/gameTypes.js";

/**
 * Core game engine for Tic-Tac-Toe on NxN boards with 5-in-a-row win condition.
 */

const DIRECTIONS = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
];

/**
 * Check if placing a mark at (row, col) results in a win.
 * Returns the winning cells array or null.
 */
export const checkWin = (board, row, col, marker) => {
  const size = board.length;

  for (const [dr, dc] of DIRECTIONS) {
    const cells = [[row, col]];

    // Count forward
    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (board[r][c] !== marker) break;
      cells.push([r, c]);
    }

    // Count backward
    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (board[r][c] !== marker) break;
      cells.push([r, c]);
    }

    if (cells.length >= WIN_LENGTH) {
      return cells;
    }
  }

  return null;
};

/**
 * Check if the board is full (draw).
 */
export const isBoardFull = (board) => {
  return board.every((row) => row.every((cell) => cell !== null));
};

/**
 * Create an empty NxN board.
 */
export const createBoard = (size) => {
  return Array.from({ length: size }, () => Array(size).fill(null));
};

/**
 * Validate a move: cell must be within bounds and empty.
 */
export const isValidMove = (board, row, col) => {
  const size = board.length;
  if (row < 0 || row >= size || col < 0 || col >= size) return false;
  return board[row][col] === null;
};

/**
 * Convert board position to algebraic notation (e.g., "c2").
 * Columns: a, b, c, ... ; Rows: 1, 2, 3, ... (from bottom)
 */
export const toAlgebraic = (row, col, boardSize) => {
  const colLetter = String.fromCharCode(97 + col); // a, b, c, ...
  const rowNumber = boardSize - row; // bottom-up numbering
  return `${colLetter}${rowNumber}`;
};

/**
 * Convert algebraic notation to row/col.
 */
export const fromAlgebraic = (notation, boardSize) => {
  const col = notation.charCodeAt(0) - 97;
  const rowNumber = parseInt(notation.slice(1), 10);
  const row = boardSize - rowNumber;
  return { row, col };
};

/**
 * Count consecutive marks in a direction from a position (not counting the position itself).
 */
export const countDirection = (board, row, col, dr, dc, marker) => {
  const size = board.length;
  let count = 0;
  for (let i = 1; i < WIN_LENGTH + 1; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= size || c < 0 || c >= size) break;
    if (board[r][c] !== marker) break;
    count++;
  }
  return count;
};

/**
 * Analyze a line through a position: count consecutive marks and openness.
 * Returns { length, openEnds } for given marker.
 */
export const analyzeLine = (board, row, col, dr, dc, marker) => {
  const size = board.length;
  let length = 1;
  let openEnds = 0;

  // Forward
  let fr = row + dr;
  let fc = col + dc;
  while (fr >= 0 && fr < size && fc >= 0 && fc < size && board[fr][fc] === marker) {
    length++;
    fr += dr;
    fc += dc;
  }
  if (fr >= 0 && fr < size && fc >= 0 && fc < size && board[fr][fc] === null) {
    openEnds++;
  }

  // Backward
  let br = row - dr;
  let bc = col - dc;
  while (br >= 0 && br < size && bc >= 0 && bc < size && board[br][bc] === marker) {
    length++;
    br -= dr;
    bc -= dc;
  }
  if (br >= 0 && br < size && bc >= 0 && bc < size && board[br][bc] === null) {
    openEnds++;
  }

  return { length, openEnds };
};

/**
 * Get all empty cells on the board.
 */
export const getEmptyCells = (board) => {
  const cells = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === null) cells.push([r, c]);
    }
  }
  return cells;
};

/**
 * Get all empty cells adjacent to any occupied cell (for more focused move generation).
 */
export const getRelevantCells = (board, radius = 2) => {
  const size = board.length;
  const relevant = new Set();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== null) {
        for (let dr = -radius; dr <= radius; dr++) {
          for (let dc = -radius; dc <= radius; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === null) {
              relevant.add(`${nr},${nc}`);
            }
          }
        }
      }
    }
  }

  return [...relevant].map((s) => s.split(",").map(Number));
};
