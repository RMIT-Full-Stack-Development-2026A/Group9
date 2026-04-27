import { checkWinLine, isDraw } from "../engine/gameEngine.js";

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
