/**
 * ============================================================================
 * GAME ROOM MODEL (The Virtual Lobby Blueprint)
 * ============================================================================
 * Purpose: While 'GameSession' tracks the board and moves, the 'GameRoom' 
 * tracks the "Container" or "Lobby." In TicTacToang, this model manages 
 * the social and access layers of a match before the first 'X' or 'O' 
 * is even placed.
 * * Key Responsibilities:
 * 1. Metadata: Room names, host information, and creation time.
 * 2. Access Control: Private vs. Public status and invite codes.
 * 3. Capacity: Ensuring only 2 players can enter a standard match.
 * 4. Chat/Social: Linking to a separate collection for in-game messaging.
 * * CRITICAL RULE: This model is about the "Waiting Room." Once both 
 * players are ready, this model links to a 'GameSession' ID where the 
 * actual gameplay logic lives.
 */

//manages online multiplayer rooms and player matchmaking.

// {
//   roomNumber: { type: String },

//   player1: { type: ObjectId, ref: "User" },
//   player2: { type: ObjectId, ref: "User" },

//   status: { type: String, enum: ["waiting", "playing", "finished"] },

//   selectedBoardSize: { type: Number },
//   selectedMarkers: [{ type: String }],

//   startTime: { type: Date },
//   endTime: { type: Date }
// }