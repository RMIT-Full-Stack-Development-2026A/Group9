import React from "react";
import GameBoard from "../components/GameBoard/GameBoard.jsx";

export default function LocalGameArena({settings, onAbort, onGameEnd}){
  // settings: { player1, player2, boardSize, boardStyle, firstPlayer }
  // Pass all settings as props for backend session
  return (
    <div>
      <GameBoard
        {...settings}
        firstPlayer={settings.firstPlayer}
        onAbort={onAbort}
        onGameEnd={onGameEnd}
      />
    </div>
  );
}
