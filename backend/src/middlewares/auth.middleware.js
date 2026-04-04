/**
 * ============================================================================
 * AUTHENTICATION MIDDLEWARE (The Gatekeeper)
 * ============================================================================
 * Purpose: Protects secure routes by verifying the user's identity before 
 * allowing them to reach the Controller.
 * * - Intercepts the request to find the Bearer token in the headers.
 * - Verifies the JWT signature and checks the database/cache for revocation.
 * - If valid: Grants access and attaches user data to `req.auth`.
 * - If invalid/missing: Blocks the request immediately with a 401 status.
 */