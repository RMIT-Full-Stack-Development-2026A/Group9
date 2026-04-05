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