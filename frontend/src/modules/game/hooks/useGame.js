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
export const useGame = (initialSize) => {
  const [grid, setGrid] = useState(GameService.createEmptyBoard(initialSize));
  const [isP1Turn, setIsP1Turn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]); 
  const [gameStatus, setGameStatus] = useState('active');

  const playSound = (event) => {
    const soundPath = GameService.getSoundTrigger(event)
    if (soundPath) {
      const audio = new Audio(soundPath);
      audio.play().catch(err => console.error("Audio playback failed:", err));
    }
  };

  const startGame = (startsFirst) => {
    setGrid(GameService.createEmptyBoard(initialSize));
    setIsP1Turn(startsFirst === 'X'); // 
    setWinner(null);
    setWinningLine([]);
    setGameStatus('active');
  };

  const makeMove = (row, col) => {
    if (grid[row][col] || winner || gameStatus === 'aborted') return;
    playSound("MOVE");
    const currentPlayer = isP1Turn ? 'X' : 'O';
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = currentPlayer;
    setGrid(newGrid);

    const winResult = GameService.checkWinner(newGrid, row, col, currentPlayer, initialSize);
    
    if (winResult) {
      setWinner(currentPlayer);
      setWinningLine(winResult); 
      setGameStatus('won');
      playSound("GAMEOVER");
    } else {
      setIsP1Turn(!isP1Turn);
    }
  };

  const abortGame = () => setGameStatus('aborted');

  return { grid, isP1Turn, winner, winningLine, gameStatus, makeMove, abortGame, startGame };
};