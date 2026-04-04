
// Authentication middleware for Express.js
// - Checks for a Bearer token in the Authorization header
// - Verifies the JWT using the configured secret
// - Checks if the token is revoked
// - Attaches authentication info to req.auth if valid
// - Responds with 401 Unauthorized if any check fails