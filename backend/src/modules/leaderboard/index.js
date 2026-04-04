/**
 * ============================================================================
 * LEADERBOARD MODULE INDEX (The Ranking Gateway)
 * ============================================================================
 * Purpose: This file acts as the "Public Interface" for the Leaderboard 
 * module. In our TicTacToang modular monolith, this is the only file that 
 * other modules (like Game or User) should import from.
 * * Key Responsibilities:
 * 1. Export the Router: To be mounted in the main application routes.
 * 2. Export Services: So the Game module can trigger a rank update after a win.
 * 3. Export Constants: Sharing rank names or tier thresholds.
 * * CRITICAL RULE: High-level encapsulation. We hide the complex MongoDB 
 * aggregation pipelines inside the Repository and only show clean, 
 * easy-to-use functions here.
 */