/**
 * ============================================================================
 * USE GAME HOOK (The Engine)
 * ============================================================================
 * Location: src/modules/game/hooks/useGame.js
 * Purpose: This hook manages the local state of a match and orchestrates
 * the game logic. It bridges the gap between the UI components (Board, Status)
 * and the backend (via WebSockets or Services).
 * * Key Responsibilities:
 * 1. State Management: Keeping track of the board, current turn, and history.
 * 2. Move Validation: Preventing moves on occupied cells or out of turn.
 * 3. Win Detection: Running the algorithm to check for 3-in-a-row.
 * 4. Sync: (Future) Handling Socket.io events to keep two players in sync.
 */
import { useState } from 'react';
import { GameService } from '../services/game.service';
export const useGame = (initialSize = 10, p1Mark = 'X', p2Mark = 'O') => {
  const [grid, setGrid] = useState(GameService.createEmptyBoard(initialSize));
  const [isP1Turn, setIsP1Turn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameStatus, setGameStatus] = useState('active')
//Preventing moves on occupied cells or out of turn.
  const makeMove = (row, col) => {
    if (grid[row][col] || winner || gameStatus === 'aborted') return;
//Keeping track of the board, current turn, and history.
    const currentPlayer = isP1Turn ? p1Mark : p2Mark;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = currentPlayer;
    
    setGrid(newGrid);
//Win Detection: Running the algorithm to check for 5-in-a-row.
    if (GameService.checkWinner(newGrid, row, col, currentPlayer, initialSize)) {
      setWinner(currentPlayer);
      setGameStatus('won');
    } else {
      setIsP1Turn(!isP1Turn);
    }
  };
  const abortGame = () => {
    setGameStatus('aborted');
  };

  return {
    grid,
    isP1Turn,
    winner,
    gameStatus,
    makeMove,
    abortGame
  };
};