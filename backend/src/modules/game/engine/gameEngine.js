/**
 * ============================================================================
 * GAME ENGINE (The Heartbeat of TicTacToang)
 * ============================================================================
 * Purpose: This file is the central "Switcher" for your game logic. While 
 * the GameService handles database records and the AI files handle individual 
 * "thinking," the GameEngine decides WHICH logic to run based on the game mode.
 * * Key Responsibilities:
 * 1. Mode Detection: Is this Player vs. Player or Player vs. AI?
 * 2. AI Selection: If vs. AI, which difficulty level is being used?
 * 3. Result Calculation: A single, fast utility to check for wins or draws 
 * that all other services can use to stay consistent.
 * * CRITICAL RULE: The Engine should be "Stateless." It takes a board and 
 * some settings, runs a calculation, and spits out a result. It doesn't 
 * care about database IDs or HTTP requests.
 */