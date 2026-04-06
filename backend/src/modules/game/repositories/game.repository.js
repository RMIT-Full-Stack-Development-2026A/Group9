/**
 * ============================================================================
 * GAME REPOSITORY (The Scorekeeper / Data Access Layer)
 * ============================================================================
 * Purpose: This file is the ONLY place in the Game module allowed to talk 
 * directly to the database (MongoDB/Mongoose). It handles the storage and 
 * retrieval of match states, player moves, and match history.
 * * Key Responsibilities:
 * 1. Create new game documents in the 'games' collection.
 * 2. Update the board array and turn status during active play.
 * 3. Fetch finished games for a user's match history.
 * 4. Perform aggregations for leaderboards (e.g., counting wins).
 * * CRITICAL RULE: A Repository must NEVER contain game logic (e.g., it 
 * shouldn't know how to check for a "win") and NEVER know about HTTP. It 
 * simply executes the database commands the Service asks for.
 */

// Implementation contract:
// 1) Persist sessions/moves atomically where needed (transactions when required).
// 2) Keep method names explicit: createSession, appendMove, setSessionResult, etc.
// 3) No board-rule logic here; this layer is read/write only.