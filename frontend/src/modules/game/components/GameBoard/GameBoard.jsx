/**
 * ============================================================================
 * GAME BOARD COMPONENT (The Grid)
 * ============================================================================
 * Location: src/modules/game/components/GameBoard.jsx
 * Purpose: This is the visual representation of the TicTacToang match. It 
 * renders a 10x10 (or 15x15) grid and handles the "Click" events for player moves.
 * * Key Responsibilities:
 * 1. Grid Rendering: Mapping a simple array of 9 values into a CSS Grid.
 * 2. Interaction: Capturing which index (0-8) the player clicked.
 * 3. Visual Feedback: Displaying "X", "O", or an empty space with animations.
 * 4. State Sync: Reflecting the 'board' state received from the backend.
 */