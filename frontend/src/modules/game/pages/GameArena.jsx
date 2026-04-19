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
import './GameArea.css'

export default function GameArena() {
	const { grid, isP1Turn, winner, gameStatus, makeMove, abortGame } = useGame(10);
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