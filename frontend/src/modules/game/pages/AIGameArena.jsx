import React from "react";
import GameBoard from "../components/GameBoard/GameBoard.jsx";

export default function AIGameArena({ settings, onAbort, onGameEnd }) {
  // Thin page: pass settings down, keep AI orchestration in hooks/components.
  return (
    <div>
      <GameBoard
        {...settings}
        onAbort={onAbort}
        onGameEnd={onGameEnd}
        aiLevel={settings.aiLevel}
      />
    </div>
  );
}
