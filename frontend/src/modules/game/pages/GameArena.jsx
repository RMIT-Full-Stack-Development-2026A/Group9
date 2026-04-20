/**
 * ============================================================================
 * GAME ARENA PAGE (The Stage)
 * ============================================================================
 * Location: src/pages/GameArena.jsx
 * Purpose: This is the primary gameplay screen. It assembles the Board, 
 * Chat, and Player Stats components from the 'game' and 'chat' modules.
 * * Key Responsibilities:
 * 1. Layout Management: Positioning the board vs. the chat sidebar.
 * 2. Room Initialization: Extracting the 'gameId' from the URL.
 * 3. Error Boundary: Showing a "Game Not Found" state if the ID is invalid.
 */

import { useGame } from "../hooks/useGame"
import { Board } from "../components/GameBoard/GameBoard"
import { GameStatus } from "../components/GameStatus/GameStatus"
import { useState } from "react"
import './GameArea.css'
import 'bootstrap/dist/css/bootstrap.css'
export default function GameArena() {
  const [setupData, setSetupData] = useState(null); 
  const [tempGuestName, setTempGuestName] = useState("");
  const [tempStarter, setTempStarter] = useState("X");
  const { grid, isP1Turn, winner, winningLine, gameStatus, makeMove, abortGame, startGame } = useGame(10);
  const handleStartGame = () => {
    if (!tempGuestName.trim()) {
      alert("Please enter a guest name!");
      return;
    }
    setSetupData({ guestName: tempGuestName, starter: tempStarter });
    startGame(tempStarter); // Resets board and sets first player
  };

  // 1. Setup View (Before game starts)
  if (!setupData) {
    return (
      <div className="container py-5">
        <div className="card mx-auto shadow-sm" style={{ maxWidth: '400px' }}>
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Match Setup</h3>
            <div className="mb-3">
              <label className="form-label">Guest (Player 2) Name</label>
              <input
                type="text"
                className="form-control"
                value={tempGuestName}
                onChange={(e) => setTempGuestName(e.target.value)}
                placeholder="e.g. Anh Duy"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Who starts first?</label>
              <select
                className="form-select"
                value={tempStarter}
                onChange={(e) => setTempStarter(e.target.value)}
              >
                <option value="X">Player 1 (X)</option>
                <option value="O">Guest (O)</option>
              </select>
            </div>
            <button className="btn btn-primary w-100" onClick={handleStartGame}>
              Enter Arena
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="arena-container container py-4">
      <h2 className="text-center mb-4">TicTacToang Arena</h2>

      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <GameStatus
            isP1Turn={isP1Turn}
            winner={winner}
            status={gameStatus}
            p1Mark="X"
            p2Mark="O"
          />

          <Board
            grid={grid}
            onMove={makeMove}
            disabled={gameStatus !== 'active'}
            winningLine={winningLine}
            isP1Turn={isP1Turn}
          />

          <button
            className="btn btn-outline-danger mt-4"
            onClick={abortGame}
            disabled={gameStatus !== 'active'}
          >
            Abort Match
          </button>
        </div>
      </div>
    </div>
  )
}