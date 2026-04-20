/**
 * ============================================================================
 * GAME BOARD COMPONENT (The Grid)
 * ============================================================================
 * Location: src/modules/game/components/GameBoard.jsx
 * Purpose: This is the visual representation of the TicTacToang match. It 
 * renders a 10x10 (or 15x15) grid and handles the "Click" events for player moves.
 * * Key Responsibilities:
 * 1. Grid Rendering: Mapping a simple array of 9 values into a CSS Grid.
 * 2. Interaction: Capturing which index (0-8) the player clicked.
 * 3. Visual Feedback: Displaying "X", "O", or an empty space with animations.
 * 4. State Sync: Reflecting the 'board' state received from the backend.
 */
import { Cell } from "../Cell/Cell";

export const Board = ({ grid, onMove, disabled, winningLine = [] , isP1Turn }) => {
  const currentMark = isP1Turn ? 'X' : 'O';
  return (
    <div 
      className="game-board shadow-lg" 
      style={{ 
        gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
        aspectRatio: "1 / 1" 
      }}
    >
      {grid.map((row, rowIndex) => 
        row.map((cellValue, colIndex) => {
          // Check if this specific cell is part of the winning 5-mark line
          const isWinningCell = winningLine.some(
            (coord) => coord.r === rowIndex && coord.c === colIndex
          );

          return (
            <Cell 
              key={`${rowIndex}-${colIndex}`}
              value={cellValue}
              onClick={() => onMove(rowIndex, colIndex)}
              disabled={disabled}
              isHighlight={isWinningCell} 
              currentMark={currentMark}
            />
          );
        })
      )}
    </div>
  );
};