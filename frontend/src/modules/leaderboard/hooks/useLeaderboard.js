/**
 * ============================================================================
 * USE LEADERBOARD HOOK (The Rank Controller)
 * ============================================================================
 * Location: src/modules/leaderboard/hooks/useLeaderboard.js
 * Purpose: This hook manages the logic for fetching and filtering the global 
 * "Toang" rankings. It provides a clean interface for the Leaderboard page.
 * * Key Responsibilities:
 * 1. Data Fetching: Loading the top players from the Game API.
 * 2. Pagination/Filtering: Handling "Top 10" vs "Top 50" or local vs global.
 * 3. State Management: Managing loading, error, and refresh states.
 * 4. Sorting: Ensuring players are correctly ordered by XP.
 */