/**
 * ============================================================================
 * ADMIN ROUTER (The Map / Directory)
 * ============================================================================
 * Purpose: This file defines the actual URLs (endpoints) for the Admin module.
 * It connects a specific HTTP Method (GET, POST, etc.) and a URL path to the 
 * correct Controller function. It also applies necessary security Bouncers 
 * (Middleware) before the request is allowed to reach the Controller.
 * * Key Responsibilities:
 * 1. Define routes (e.g., GET /users, POST /users/:id/ban).
 * 2. Attach Global Middleware (e.g., requireAuth to ensure they are logged in).
 * 3. Attach Module-Specific Middleware (e.g., requireAdminRole).
 * 4. Delegate the final request to the Controller.
 * * CRITICAL RULE: A Route file must NEVER contain business logic, database calls,
 * or even HTTP response formatting (res.status). It is strictly a "wiring" file 
 * that connects URLs to Controllers.
 */