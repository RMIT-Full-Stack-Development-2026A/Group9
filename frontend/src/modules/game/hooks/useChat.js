/**
 * ============================================================================
 * USE CHAT HOOK (The Trash Talk Engine)
 * ============================================================================
 * Location: src/modules/game/hooks/useChat.jsx
 * Purpose: This hook manages the real-time communication between players.
 * It's essential for the "Toang" experience—allowing players to celebrate 
 * wins or discuss strategies during the match.
 * * Key Responsibilities:
 * 1. Message Sync: Sending and receiving text messages via WebSockets.
 * 2. History Management: Keeping a local buffer of the last X messages.
 * 3. Notification Logic: Tracking unread messages or "System" alerts.
 * 4. Cleanup: Ensuring listeners are removed when the match ends.
 */