/**
 * ============================================================================
 * CELL COMPONENT (The Interactive Square)
 * ============================================================================
 * Location: src/modules/game/components/Cell.jsx
 * Purpose: This is the smallest unit of the TicTacToang board. While 
 * GameBoard.jsx manages the 10x10 layout, this component focuses on the 
 * individual behavior, animations, and sound effects of a single square.
 * * Key Responsibilities:
 * 1. Semantic Markup: Using buttons for accessibility (keyboard navigation).
 * 2. Visual State: Handling 'X', 'O', or 'Empty' rendering.
 * 3. Event Bubbling: Passing clicks back up to the GameBoard.
 * 4. Conditional Styling: Highlighting if the cell is part of a winning line.
 */
export const Cell = ({ value, onClick, disabled, isHighlight,currentMark }) => {
  return (
    <button 
      className={`game-cell ${isHighlight ? 'winner-cell' : ''} ${value ? 'occupied' : ''}`}
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={value ? `Marked ${value}` : "Empty cell"}
      data-hover={!value ? currentMark : ''}
    >
      <span className={value === 'X' ? 'text-danger' : 'text-primary'}>
        {value}
      </span>
    </button>
  );
};