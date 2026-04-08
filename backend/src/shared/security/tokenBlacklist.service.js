/**
 * ============================================================================
 * TOKEN BLACKLIST SERVICE (The Logout & Security Guard)
 * ============================================================================
 * Purpose: This file manages "Revoked" JSON Web Tokens (JWTs). In a standard 
 * JWT setup, tokens are valid until they expire. This service allows 
 * TicTacToang to "Kill" a token immediately when a user logs out or if 
 * a security breach is detected.
 * * Key Responsibilities:
 * 1. Logout Execution: Adding a valid token to the blacklist so it can't 
 * be used again.
 * 2. Token Validation: Checking every incoming request to see if the 
 * provided token has been "Blacklisted."
 * 3. Automatic Cleanup: Removing expired tokens from the blacklist to 
 * keep the database small.
 * * CRITICAL RULE: This service is a "Gatekeeper" in your Auth Middleware. 
 * If a token is in this list, the request is rejected with a 401 Unauthorized, 
 * even if the signature is technically "Valid."
 */