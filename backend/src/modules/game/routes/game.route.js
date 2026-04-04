/**
 * ============================================================================
 * GAME ROUTER (The Matchmaking Directory)
 * ============================================================================
 * Purpose: This file defines the API endpoints for the TicTacToang game logic.
 * It maps URLs to the Controller functions and ensures only authorized 
 * players can create or join matches.
 * * Key Responsibilities:
 * 1. Define game-specific endpoints (e.g., POST /create, GET /history).
 * 2. Attach Authentication Middleware (requireAuth) to verify player identity.
 * 3. Attach Validation Middleware (DTOs) to ensure moves are within the 3x3 grid.
 * 4. Route traffic to the Game Controller.
 * * CRITICAL RULE: This file should NEVER contain the game rules (like checking 
 * for a diagonal win). It is strictly the "GPS" for the Game module's traffic.
 */