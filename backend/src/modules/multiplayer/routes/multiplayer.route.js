/**
 * ============================================================================
 * MULTIPLAYER ROUTER (The Matchmaking Hub)
 * ============================================================================
 * Purpose: This file defines the entry points for human-vs-human interactions.
 * It manages the "Lobby" phase of TicTacToang, allowing players to create rooms,
 * search for opponents, and join friends via invite codes.
 * * Key Responsibilities:
 * 1. Define routes for room management (POST /create, GET /public-lobbies).
 * 2. Attach Authentication (requireAuth) so we know which player is hosting/joining.
 * 3. Attach Validation (DTOs) to prevent invalid room names or invite codes.
 * 4. Route traffic to the Multiplayer Controller.
 * * CRITICAL RULE: This router is for HTTP requests (REST). Once a match starts,
 * the real-time gameplay logic usually transitions to WebSockets, but the 
 * "Setup" always starts here.
 */