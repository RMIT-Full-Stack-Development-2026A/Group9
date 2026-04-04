/**
 * ============================================================================
 * GAME DTO (Data Transfer Object / The Move Validator)
 * ============================================================================
 * Purpose: This file defines the rules for incoming game data. In a competitive 
 * game like TicTacToang, DTOs are essential to prevent players from "cheating" 
 * by sending moves to non-existent squares, playing twice in a row, or 
 * manipulating the game ID.
 * * Key Responsibilities:
 * 1. Validate Move Positions (Ensure index is 0-8).
 * 2. Validate Game IDs (Ensure they are valid MongoDB ObjectIds).
 * 3. Validate Room Creation (e.g., private vs public settings).
 * * CRITICAL RULE: The DTO only checks if a move is *possible* (e.g., "is 5 a 
 * valid square?"). The Service layer checks if the move is *legal* (e.g., 
 * "is it actually your turn?").
 */