/**
 * ============================================================================
 * USE GAME HOOK (The Engine)
 * ============================================================================
 * Location: src/modules/game/hooks/useGame.js
 * Purpose: This hook manages the local state of a match and orchestrates
 * the game logic. It bridges the gap between the UI components (Board, Status)
 * and the backend (via WebSockets or Services).
 * * Key Responsibilities:
 * 1. State Management: Keeping track of the board, current turn, and history.
 * 2. Move Validation: Preventing moves on occupied cells or out of turn.
 * 3. Win Detection: Running the algorithm to check for 3-in-a-row.
 * 4. Sync: (Future) Handling Socket.io events to keep two players in sync.
 */