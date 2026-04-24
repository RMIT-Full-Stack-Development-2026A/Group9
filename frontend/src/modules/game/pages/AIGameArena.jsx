import React from "react";
import LocalGameBoard from "../components/LocalGameBoard.jsx";

export default function AIGameArena({ settings, onAbort, onGameEnd }) {
  // Thin page: pass settings down, keep AI orchestration in hooks/components.
  return (
    <div>
      <LocalGameBoard
        {...settings}
        onAbort={onAbort}
        onGameEnd={onGameEnd}
        aiLevel={settings.aiLevel}
      />
    </div>
  );
}
