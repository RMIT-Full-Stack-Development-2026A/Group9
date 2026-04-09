/**
 * ============================================================================
 * EASY AI SERVICE (The "Random" Challenger)
 * ============================================================================
 * Purpose: This file contains the logic for a basic Single-Player mode in 
 * TicTacToang. The "Easy" AI doesn't think strategically; it simply looks for 
 * any empty square and claims it. This is perfect for testing your game 
 * mechanics or for younger players.
 * * Key Responsibilities:
 * 1. Scan the current board for available 'null' indices.
 * 2. Pick one of those indices at random.
 * 3. Return the chosen move to the Game Service or Facade.
 * * CRITICAL RULE: This is a "Pure Utility" service. It should not touch the 
 * database itself. It should receive a board array, and return a number (0-8).
 */