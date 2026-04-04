/**
 * ============================================================================
 * LEADERBOARD DTO (Data Transfer Object / The Query Validator)
 * ============================================================================
 * Purpose: This file ensures that when a user filters or requests the 
 * leaderboard, the parameters they send (like limit or category) are safe, 
 * valid, and won't crash the database. 
 * * Key Responsibilities:
 * 1. Validate 'limit' (Ensure a user doesn't try to fetch 1,000,000 rows at once).
 * 2. Validate 'category' (Ensure the user only sorts by fields that actually exist).
 * 3. Sanitize 'page' (For pagination logic).
 * * CRITICAL RULE: This is the "Bouncer" for the Leaderboard. If a user tries 
 * to send `?limit=unlimited` or `?category=passwords`, this file stops the 
 * request before it ever touches your database logic.
 */