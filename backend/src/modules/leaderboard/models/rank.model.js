/**
 * ============================================================================
 * RANK MODEL (The Progression Blueprint)
 * ============================================================================
 * Purpose: While the User model tracks XP and wins, the Rank model defines 
 * the "Tiers" of TicTacToang. It acts as a reference table that maps XP 
 * thresholds to specific titles (e.g., Bronze, Silver, Grandmaster).
 * * Key Responsibilities:
 * 1. Define XP requirements for each level.
 * 2. Store metadata for ranks (e.g., Badge Icons, Rank Names).
 * 3. Provide a structure for "Tier-based" matchmaking (e.g., only Gold vs Gold).
 * * CRITICAL RULE: This model is usually "Static" or "Read-Heavy." You likely 
 * won't create new Ranks via the API often; you'll define them once and 
 * reference them to show users their current "League."
 */