/**
 * ============================================================================
 * LEADERBOARD SERVICE (The Hall of Fame Logic)
 * ============================================================================
 * Purpose: This file handles the heavy lifting for ranking players in 
 * "TicTacToang." It performs the calculations, aggregations, and sorting 
 * required to turn raw user data into a competitive list.
 * * Key Responsibilities:
 * 1. Calculate Global Rankings: Sort players by wins, XP, or win-loss ratio.
 * 2. Find a Specific Player's Rank: Determine if a user is #1 or #1,000.
 * 3. Filter Leaderboards: Logic for "All Time" vs. "This Month" rankings.
 * 4. Coordinate with UserRepository to fetch player profiles for the list.
 * * CRITICAL RULE: The Service layer NEVER knows about HTTP. It receives 
 * numbers (like 'limit') and IDs, performs database aggregations, and 
 * returns the sorted results.
 */