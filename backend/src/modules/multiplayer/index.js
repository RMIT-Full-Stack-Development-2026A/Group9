/**
 * ============================================================================
 * MULTIPLAYER MODULE INDEX (The Social Entry Point)
 * ============================================================================
 * Purpose: This file acts as the "Public API" for the Multiplayer module 
 * within the TicTacToang modular monolith. It coordinates how other modules 
 * (like Game or User) interact with lobby management and matchmaking.
 * * Key Responsibilities:
 * 1. Export the Router: To be mounted in the main application's route list.
 * 2. Export Services: Allowing the Game module to "hand off" a player once 
 * a match is found.
 * 3. Export Socket Handlers: If using Socket.io, this file often exports 
 * the logic that links physical connections to game rooms.
 * * CRITICAL RULE: This is the "Clean Interface." Other modules should not 
 * reach inside and grab 'gameRoom.model.js' directly. They must use the 
 * functions exported here.
 */