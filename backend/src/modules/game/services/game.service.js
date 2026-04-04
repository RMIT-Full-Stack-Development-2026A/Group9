/**
 * ============================================================================
 * GAME SERVICE (The Logic Engine / TicTacToang Brain)
 * ============================================================================
 * Purpose: This file contains the "Rules of the Game." It is responsible for 
 * move validation, determining winners, managing game states (lobby, active, 
 * finished), and updating player rankings. 
 * * Key Responsibilities:
 * 1. Win Condition Detection: Logic to check rows, columns, and diagonals.
 * 2. Turn Management: Ensuring Player A doesn't move during Player B's turn.
 * 3. Matchmaking: Logic for pairing players or creating private rooms.
 * 4. Coordinate with GameRepository to persist the board state.
 * * CRITICAL RULE: This file is "Pure Logic." It doesn't know about Express 
 * 'res' or 'req' objects. It strictly takes data, applies rules, and returns 
 * results or throws game-specific errors (e.g., "Invalid Move").
 */