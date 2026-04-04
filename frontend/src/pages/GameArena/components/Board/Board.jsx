import "./Board.css";

const Board = ({ board, boardStyle, winningCells, onCellClick, lastMove, disabled }) => {
  const size = board.length;

  const isWinningCell = (row, col) => {
    if (!winningCells) return false;
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  const isLastMove = (row, col) => {
    return lastMove && lastMove.row === row && lastMove.col === col;
  };

  // Algebraic notation (Req 4.3.3)
  const colLabel = (c) => String.fromCharCode(97 + c);
  const rowLabel = (r) => String(size - r);

  return (
    <div className="board-wrapper">
      {/* Column labels */}
      <div className="board-col-labels" style={{ gridTemplateColumns: `32px repeat(${size}, 1fr)` }}>
        <span />
        {Array.from({ length: size }, (_, c) => (
          <span key={c} className="board-label">{colLabel(c)}</span>
        ))}
      </div>

      <div className="board-with-rows">
        {/* Row labels + Board */}
        <div className="board-row-labels">
          {Array.from({ length: size }, (_, r) => (
            <span key={r} className="board-label">{rowLabel(r)}</span>
          ))}
        </div>

        <div
          className={`board board-style-${boardStyle}`}
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                className={`cell ${cell ? "cell--filled" : ""} ${
                  isWinningCell(r, c) ? "cell--winning" : ""
                } ${isLastMove(r, c) ? "cell--last" : ""}`}
                onClick={() => !disabled && !cell && onCellClick(r, c)}
                disabled={disabled || !!cell}
                title={`${colLabel(c)}${rowLabel(r)}`}
              >
                {cell && <span className="cell-marker">{cell}</span>}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;