/**
 * ============================================================================
 * CHAT SOCKET HANDLER (The Trash Talk Engine)
 * ============================================================================
 * Purpose: This file manages the real-time communication between players 
 * during a TicTacToang match. It handles sending, receiving, and 
 * broadcasting messages instantly without page refreshes.
 * * Key Responsibilities:
 * 1. Room-Based Messaging: Ensuring messages only go to the two players 
 * currently in that specific game room.
 * 2. Event Routing: Listening for 'sendMessage' and emitting 'newMessage'.
 * 3. System Notifications: Broadcasting automated messages (e.g., "Player 1 
 * has left the chat").
 * * CRITICAL RULE: This is a "Socket Sub-Handler." It should be imported 
 * and initialized by your main 'socketServer.js' to keep the code organized.
 */