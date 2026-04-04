/**
 * ============================================================================
 * GAME SESSION MODEL (The TicTacToang Match Blueprint)
 * ============================================================================
 * Purpose: This file defines the schema for an active or completed game match.
 * It tracks the board state, which players are in the room, whose turn it is, 
 * and the final result.
 * * Key Responsibilities:
 * 1. Store the 3x3 grid as an array.
 * 2. Maintain a relationship with the User collection (Player X and Player O).
 * 3. Track the game lifecycle (waiting -> active -> finished).
 * * CRITICAL RULE: This model should be "Lean." We don't store the entire 
 * move history here (usually); we just store the current "Source of Truth" 
 * for the board so the frontend can render it.
 */

//stores match history, including players, game settings, results, and timestamps.

// {
//   players: [{ type: ObjectId, ref: "User" }],

//   gameType: { type: String, enum: ["single", "local", "online"] },
//   opponentType: { type: String, enum: ["AI", "HUMAN"] },
//   boardSize: { type: Number },

//   winner: { type: ObjectId, ref: "User" },
//   result: { type: String, enum: ["win", "lose", "draw", "aborted"] },

//   startTime: { type: Date },
//   endTime: { type: Date },

//   moves: [{ type: ObjectId, ref: "Move" }]
// }