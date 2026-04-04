/**
 * ============================================================================
 * LEADERBOARD REPOSITORY (The Data Miner / Query Layer)
 * ============================================================================
 * Purpose: This file is responsible for the complex "Read" operations required 
 * to build the rankings. While most repositories handle simple CRUD, this 
 * one often uses MongoDB Aggregation Pipelines to count wins, sort thousands 
 * of users, and calculate positions.
 * * Key Responsibilities:
 * 1. Fetch top-tier players sorted by specific fields (wins, XP, level).
 * 2. Calculate a user's numerical rank (e.g., "You are #42 out of 5000").
 * 3. Efficiently query the User collection for statistics.
 * * CRITICAL RULE: This file should NEVER contain business logic (like 
 * calculating a win-rate percentage). It should return the raw numbers and 
 * data objects so the Service layer can handle the math.
 */