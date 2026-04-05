/**
 * ============================================================================
 * OPERATIONAL ERROR HANDLER (The Standardized Messenger)
 * ============================================================================
 * Purpose: This class is a "Custom Error" constructor for TicTacToang. 
 * Instead of sending generic 500 "Internal Server Error" messages for 
 * everything, this allows us to send specific, helpful feedback (like 400 
 * "Invalid Move" or 404 "Room Not Found") to the frontend.
 * * Key Responsibilities:
 * 1. Status Mapping: Automatically determining if an error is a "Fail" (4xx) 
 * or an "Error" (5xx).
 * 2. Operational Flagging: Distinguishing between "Trusted" errors (logic 
 * we predicted, like a full lobby) and "Unknown" bugs (programming errors).
 * 3. Stack Trace: Capturing where the error happened without polluting 
 * the production response.
 * * CRITICAL RULE: Use this for all "Business Logic" failures. Do not use 
 * it for syntax errors or database connection failures.
 */