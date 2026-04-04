/**
 * ============================================================================
 * LEADERBOARD ROUTER (The Hall of Fame Map)
 * ============================================================================
 * Purpose: This file defines the entry points for the "TicTacToang" global 
 * rankings and player statistics. It maps URLs to the Leaderboard Controller 
 * functions so players can see how they stack up against the competition.
 * * Key Responsibilities:
 * 1. Define public routes for top rankings (e.g., GET /global).
 * 2. Define protected routes for personal rankings (e.g., GET /me).
 * 3. Define routes for specific categories (e.g., GET /top-wins).
 * 4. Attach necessary middleware (Rate Limiting, Authentication).
 * * CRITICAL RULE: This file is strictly for routing. It should never touch 
 * the database or perform ranking calculations. It simply directs traffic 
 * to the Leaderboard Controller.
 */