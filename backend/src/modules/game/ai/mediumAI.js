/**
 * ============================================================================
 * MEDIUM AI SERVICE (The "Opportunist" / Tactical Challenger)
 * ============================================================================
 * Purpose: This file upgrades the TicTacToang single-player experience. Unlike 
 * the Easy AI which plays randomly, the Medium AI has "Eyes." it looks for 
 * immediate threats and immediate wins before falling back to a random move.
 * * Key Responsibilities:
 * 1. Check for a Winning Move: If it can win in one move, it takes it.
 * 2. Check for a Blocking Move: If the player is about to win, it blocks them.
 * 3. Fallback: If no immediate win or block is found, it acts like the Easy AI.
 * * CRITICAL RULE: This is a "Pure Logic" service. It does not access the 
 * database. It is a decision-making engine that processes an array and 
 * returns a number (0-8).
 */