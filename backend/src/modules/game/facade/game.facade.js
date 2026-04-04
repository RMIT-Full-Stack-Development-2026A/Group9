/**
 * ============================================================================
 * GAME FACADE (The Simplified Interface / Orchestrator)
 * ============================================================================
 * Purpose: This file acts as a "Single Entry Point" for the Game module. 
 * In a complex system like TicTacToang, a single action (like a move) might 
 * involve multiple services (GameLogic, MoveHistory, UserStats, and Socket.io).
 * The Facade hides this complexity from the Controller.
 * * * Key Responsibilities:
 * 1. Coordination: Calling GameService to validate a move, then MoveService 
 * to log it, then UserService to update the player's XP.
 * 2. Simplification: Providing a "One-Click" function for the Controller so 
 * the Controller stays clean and doesn't have to import 5 different services.
 * 3. Isolation: Ensuring that if we change how moves are logged, we only 
 * change it here, not in every Controller.
 * * * CRITICAL RULE: The Facade should NOT contain core business logic itself. 
 * It is a "Conductor" of an orchestra—it tells the other services when to play.
 */