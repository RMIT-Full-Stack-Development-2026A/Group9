/**
 * ============================================================================
 * MOVE MODEL (The Match Replay Log)
 * ============================================================================
 * Purpose: While the GameSession model stores the CURRENT state of the board,
 * the Move model records every single individual action taken during a match.
 * Think of this as the "Transaction History" for a game of TicTacToang.
 * * Key Responsibilities:
 * 1. Record who made the move (Player ID).
 * 2. Record which square was clicked (0-8).
 * 3. Record exactly when the move happened (Timestamp).
 * 4. Link back to the parent GameSession ID.
 * * Use Case: This allows you to build a "Replay" feature where users can 
 * watch the game progress step-by-step, or to perform deep anti-cheat 
 * analysis by checking the speed of moves.
 */

//stores individual moves in a game for replay functionality.

// {
//   gameId: { type: ObjectId, ref: "GameSession" },
//   playerId: { type: ObjectId, ref: "User" },

//   position: { type: String }, // e.g., "c2"
//   moveNumber: { type: Number },

//   createdAt: { type: Date }
// }