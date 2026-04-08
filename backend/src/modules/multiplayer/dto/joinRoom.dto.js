/**
 * ============================================================================
 * JOIN ROOM DTO (The Lobby Entry Guard)
 * ============================================================================
 * Purpose: This file validates the data sent when a player attempts to enter 
 * a "TicTacToang" game room. It ensures that the request contains the 
 * necessary credentials (like a Room ID or Invite Code) in the correct format 
 * before the server spends any resources looking up the lobby.
 * * Key Responsibilities:
 * 1. ID Validation: Checking if the 'roomId' is a valid 24-character hex string.
 * 2. Code Sanitization: Ensuring 'inviteCode' is alphanumeric and not too long.
 * 3. Security: Preventing "NoSQL Injection" by enforcing strict string types.
 * * CRITICAL RULE: This DTO only checks the "Shape" of the incoming request. 
 * It does NOT check if the room is full or if the password is correct (that 
 * is Business Logic for the Multiplayer Service).
 */