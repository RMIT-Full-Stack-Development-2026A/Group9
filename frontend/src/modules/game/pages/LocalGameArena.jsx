import React from "react";
import LocalGameBoard from "../components/LocalGameBoard.jsx";

export default function LocalGameArena({settings, onAbort, onGameEnd}){
  // settings: { player1, player2, boardSize, boardStyle, firstPlayer }
  // Pass all settings as props for backend session
  return (
    <div>
      <LocalGameBoard
        {...settings}
        firstPlayer={settings.firstPlayer}
        onAbort={onAbort}
        onGameEnd={onGameEnd}
      />
    </div>
  );
}
