/**
 * ============================================================================
 * MOVE DTO (Data Transfer Object / The Move Validator)
 * ============================================================================
 * Purpose: This file acts as the "Entry Guard" for every single move made in 
 * TicTacToang. Before the GameEngine processes a move, this DTO ensures the 
 * data is structurally sound (e.g., the index is 0-8, not 99).
 * * Key Responsibilities:
 * 1. Range Validation: Ensuring the 'position' is between 0 and 8.
 * 2. Type Checking: Ensuring 'gameId' is a valid MongoDB ObjectId string.
 * 3. Symbol Verification: Ensuring the player is only sending 'X' or 'O'.
 * * CRITICAL RULE: The DTO only checks the "Shape" of the data. It does NOT 
 * check if the square is already taken (that is Business Logic for the Service).
 */