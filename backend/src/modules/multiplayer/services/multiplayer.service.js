/**
 * ============================================================================
 * MULTIPLAYER SERVICE (The Matchmaker / Lobby Logic)
 * ============================================================================
 * Purpose: This file manages the "Social" side of TicTacToang. It handles 
 * the logic for pairing human players together, managing private invite codes, 
 * and ensuring that a game session is ready for real-time WebSocket interaction.
 * * Key Responsibilities:
 * 1. Find or Create: Logic to look for open lobbies before creating a new one.
 * 2. Privacy Logic: Generating and validating unique invite codes for private rooms.
 * 3. Match Lifecycle: Moving a game from 'waiting' to 'active' once Player 2 joins.
 * 4. Coordinate with GameRepository: To save the initial "Handshake" state.
 * * CRITICAL RULE: This service handles the "Lobby" state. Once the game 
 * starts and moves are being made, the logic should hand off to the GameService.
 */

// Implementation contract:
// 1) Keep room matchmaking rules centralized in this service.
// 2) Perform conflict-safe joins (avoid two players claiming one slot).
// 3) Return room/session handoff payload for socket initialization.