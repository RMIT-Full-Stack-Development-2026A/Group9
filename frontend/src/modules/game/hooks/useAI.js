/**
 * ============================================================================
 * USE AI HOOK (The Virtual Opponent)
 * ============================================================================
 * Location: src/modules/game/hooks/useAI.js
 * Purpose: This hook provides the logic for a Single Player mode. It "watches"
 * the board and automatically triggers a move for the 'O' player after a 
 * short delay to simulate "thinking."
 * * Key Responsibilities:
 * 1. Automation: Detecting when it's the AI's turn.
 * 2. Strategy: Implementing algorithms (Random, Defensive, or Minimax).
 * 3. UX: Adding a 'thinking' delay so the AI doesn't move instantly.
 */