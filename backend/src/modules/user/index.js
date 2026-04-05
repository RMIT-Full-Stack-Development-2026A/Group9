/**
 * ============================================================================
 * USER MODULE INDEX (The Identity Gateway)
 * ============================================================================
 * Purpose: This file acts as the "Public Face" of the User module in the 
 * TicTacToang modular monolith. It provides a clean, controlled interface 
 * for other modules (like Game, Multiplayer, or Leaderboard) to interact 
 * with user data without needing to know the internal folder structure.
 * * Key Responsibilities:
 * 1. Export the Router: For the main application to mount user-related URLs.
 * 2. Export the Service: To allow other modules to update XP or fetch profiles.
 * 3. Export Constants: Sharing shared defaults like 'DEFAULT_AVATAR_URL'.
 * * CRITICAL RULE: This is the only file that should be imported by 
 * folders outside of 'src/modules/user'. 
 */