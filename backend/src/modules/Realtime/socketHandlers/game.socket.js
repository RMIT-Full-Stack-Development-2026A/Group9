/**
 * ============================================================================
 * GAME SOCKET HANDLER (The Referee)
 * ============================================================================
 * Purpose: This file contains the real-time event listeners for the core 
 * TicTacToang gameplay. While the Multiplayer module handles "Finding a Game," 
 * this file handles "Playing the Game."
 * * Key Responsibilities:
 * 1. Move Execution: Receiving a 'makeMove' event and checking if it's legal.
 * 2. State Sync: Broadcasting the updated board to both players instantly.
 * 3. Game Over Logic: Emitting the 'matchEnd' event when someone wins or draws.
 * 4. Timer Management: Handling turn timeouts (e.g., 30 seconds to move).
 * * CRITICAL RULE: This is an Event Listener. It should call the 'GameService' 
 * to do the heavy math (checking win patterns) and only broadcast the result.
 */