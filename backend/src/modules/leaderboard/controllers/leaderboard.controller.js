/**
 * ============================================================================
 * LEADERBOARD CONTROLLER (The Trophy Room Receptionist)
 * ============================================================================
 * Purpose: This file handles HTTP requests specifically for global rankings 
 * and player statistics. While the Game module handles "Playing," this 
 * controller handles "Comparing."
 * * Key Responsibilities:
 * 1. Receive requests for the Top 10, Top 50, or Friend-only rankings.
 * 2. Pass those requests to the Leaderboard Service.
 * 3. Return a clean, sorted JSON response for the "TicTacToang" leaderboard UI.
 * * CRITICAL RULE: A Controller should NEVER perform the sorting or math 
 * itself. It asks the Service for the data and simply serves it to the user.
 */

// Implementation contract:
// 1) Parse query via leaderboard DTO and pass normalized values to service.
// 2) Enforce premium-only access through middleware, not inline conditionals.
// 3) Return DTO-shaped response objects for stable frontend integration.