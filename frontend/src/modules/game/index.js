/**
 * ============================================================================
 * GAME MODULE ENTRY POINT (The Public Interface)
 * ============================================================================
 * Location: src/modules/game/index.js
 * Purpose: This is the "Barrel Export" for the Game module. It selectively 
 * exposes components, hooks, and services to the rest of the TicTacToang app.
 * * Key Responsibilities:
 * 1. Component Export: Making GameBoard, Status, etc., available for pages.
 * 2. Hook Export: Exposing the "Engine" (useGame, useMultiplayer).
 * 3. Service Export: Providing the gameApi for matchmaking.
 * 4. Isolation: Keeping internal CSS modules and helper logic private.
 */

export { default as GameBoard } from "./components/GameBoard/GameBoard.jsx";
export { default as GameControls } from "./components/GameControls/GameControls.jsx";
export { default as GameStatus } from "./components/GameStatus/GameStatus.jsx";
export { default as MoveHistory } from "./components/MoveHistory/MoveHistory.jsx";

export { default as useGame } from "./hooks/useGame.js";
export { default as useAI } from "./hooks/useAI.js";

export * as gameService from "./services/game.service.js";
export * as gameApi from "./services/game.api.js";