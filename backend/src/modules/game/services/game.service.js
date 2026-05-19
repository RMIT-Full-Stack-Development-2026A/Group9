import { checkWinLine, isDraw } from "../engine/gameEngine.js";
import * as gameRepository from "../repositories/game.repository.js";

// ── Repository delegates ───────────────────────────────────────────────
export const createSession = (dto) => gameRepository.createSession(dto);
export const getSessionById = (sessionId) => gameRepository.getSessionById(sessionId);
export const appendMove = (sessionId, board, moveResult, moveData, updateExtra) =>
  gameRepository.appendMove(sessionId, board, moveResult, moveData, updateExtra);
export const abortSession = (sessionId) => gameRepository.abortSession(sessionId);
export const getMovesBySessionId = (sessionId) => gameRepository.getMovesBySessionId(sessionId);

// Validates a move and returns the new board, winner, and draw state
export function applyMove({ board, size, idx, marker }) {
  if (board[idx] !== null && board[idx] !== undefined) {
    throw new Error("Cell already occupied");
  }
  const newBoard = [...board];
  newBoard[idx] = marker;
  const winLine = checkWinLine(newBoard, size, marker);
  const draw = !winLine && isDraw(newBoard);
  return {
    board: newBoard,
    winLine,
    winner: winLine ? marker : null,
    draw,
  };
}

// Converts a board coordinate to algebraic notation (A1, C2, ...)
// Columns are left->right as letters, rows are bottom->top as 1..N.
export function toAlgebraicNotation(row, col, boardSize) {
  if (!Number.isInteger(row) || !Number.isInteger(col) || !Number.isInteger(boardSize)) {
    return null;
  }
  if (row < 0 || col < 0 || row >= boardSize || col >= boardSize) {
    return null;
  }

  const toLetters = (zeroBasedCol) => {
    let n = zeroBasedCol + 1;
    let out = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      out = String.fromCharCode(65 + rem) + out;
      n = Math.floor((n - 1) / 26);
    }
    return out;
  };

  const file = toLetters(col);
  const rank = boardSize - row;
  return `${file}${rank}`;
}
