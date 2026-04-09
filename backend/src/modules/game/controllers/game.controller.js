/**
 * ============================================================================
 * GAME CONTROLLER (The Match Referee)
 * ============================================================================
 * Purpose: This file handles all HTTP requests related to gameplay, match 
 * history, and player statistics. It acts as the bridge between the 
 * "TicTacToang" frontend and the Game Service.
 * * Key Responsibilities:
 * 1. Extract game move data or Room IDs from the request.
 * 2. Pass that data to the Game Service to process the move/logic.
 * 3. Send the appropriate HTTP response (e.g., 200 OK with the new board state).
 * 4. Handle real-time game creation requests.
 * * CRITICAL RULE: A Controller should NEVER contain the logic for checking 
 * a "Win Condition" or "Draw." It strictly manages the communication flow.
 */

