/**
 * ============================================================================
 * GAME MODULE INDEX (The Command Center / Export Hub)
 * ============================================================================
 * Purpose: This file is the "Public Interface" for the TicTacToang Game module.
 * It strictly controls what other modules (like Billing or User) can see and 
 * use. It keeps the "messy" internals like AI algorithms and move-history 
 * logic hidden away.
 * * Key Responsibilities:
 * 1. Export the Router: For the Master Router (src/modules/index.js) to find.
 * 2. Export the Facade: The primary way other modules trigger game events.
 * 3. Export Constants: Sharing game statuses or symbols with the frontend/API.
 * * CRITICAL RULE: Never export Models (GameSession, Move) or Repositories 
 * from here. If another module needs to interact with a game, it MUST go 
 * through the Game Facade or Game Service exported here.
 */