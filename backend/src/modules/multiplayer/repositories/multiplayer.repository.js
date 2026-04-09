
/**
 * ============================================================================
 * MULTIPLAYER REPOSITORY (The Lobby & Matchmaking Data Layer)
 * ============================================================================
 * Purpose: This file handles specialized database queries for the multiplayer 
 * "discovery" phase. While the GameRepository handles a specific match's board,
 * this repository focuses on finding open rooms, matching players by skill 
 * level, and managing invite codes.
 * * Key Responsibilities:
 * 1. Find "Waiting" Lobbies: Queries for public games needing a second player.
 * 2. Invite Code Lookups: Finding specific private sessions via unique strings.
 * 3. Matchmaking Cleanup: Identifying and closing abandoned/stale lobbies.
 * * CRITICAL RULE: This is the "Search Engine" for the Multiplayer module. 
 * It should only return data; it shouldn't handle the logic of "joining" 
 * or "starting" the game (that belongs in the Service).
 */

// Implementation contract:
// 1) Focus on room discovery and lock-safe room assignment queries.
// 2) Keep room status transitions in explicit update helpers.
// 3) Return plain room documents; orchestration belongs to service layer.