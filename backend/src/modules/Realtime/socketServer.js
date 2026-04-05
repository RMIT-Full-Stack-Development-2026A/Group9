/**
 * ============================================================================
 * SOCKET SERVER (The Real-Time Engine)
 * ============================================================================
 * Purpose: This is the "Heartbeat" of TicTacToang. While the REST API handles 
 * logins and lobby creation, this file manages the persistent, bidirectional 
 * connection (WebSockets) required for instant game moves, chat, and 
 * live notifications.
 * * Key Responsibilities:
 * 1. Connection Management: Handling when players go online/offline.
 * 2. Room Synchronization: Broadcasting a move made by Player 1 to Player 2.
 * 3. Event Routing: Passing socket data to the correct module logic.
 * * CRITICAL RULE: The Socket Server should be "Thin." It shouldn't contain 
 * game rules (like checking for a win). It should receive an event, call 
 * a Service, and broadcast the result.
 */