/**
 * ============================================================================
 * USE MULTIPLAYER HOOK (The Real-Time Sync)
 * ============================================================================
 * Location: src/modules/game/hooks/useMultiplayer.js
 * Purpose: This is the "Heart" of the online TicTacToang experience. It 
 * manages the WebSocket connection, synchronizes the board state between 
 * two remote players, and handles match-specific events.
 * * Key Responsibilities:
 * 1. Socket Management: Connecting/Disconnecting from the game namespace.
 * 2. Event Handling: Listening for 'move_made', 'player_joined', and 'game_over'.
 * 3. Latency Compensation: Optimistically updating the local UI before sync.
 * 4. Error Handling: Managing "Opponent Disconnected" scenarios.
 */