JavaScript
/**
 * ============================================================================
 * MULTIPLAYER CONTROLLER (The Lobby Manager)
 * ============================================================================
 * Purpose: This file handles the HTTP-based lifecycle of a multiplayer game. 
 * While the actual gameplay moves might happen over WebSockets (Socket.io), 
 * the "Initial Handshake"—creating a room, joining a lobby, and searching for 
 * matches—starts here.
 * * Key Responsibilities:
 * 1. Room Creation: Handling the POST request to start a private or public room.
 * 2. Matchmaking: Initializing the search for an available opponent.
 * 3. Lobby Management: Fetching a list of active "Waiting" games.
 * * CRITICAL RULE: The Controller should not manage Socket connections 
 * directly. It should use the Multiplayer Service to prepare the database 
 * state so that when the Socket connects, the room is ready.
 */