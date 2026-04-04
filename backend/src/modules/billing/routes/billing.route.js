JavaScript
/**
 * ============================================================================
 * BILLING ROUTER (The Map / Directory)
 * ============================================================================
 * Purpose: This file defines the actual URLs (endpoints) for the Billing 
 * module. It connects a specific HTTP Method (POST, GET) and a URL path to the 
 * correct Billing Controller function. It also applies necessary security 
 * Bouncers (Middleware) before the request is allowed to reach the Controller.
 * * Key Responsibilities:
 * 1. Define premium checkout routes (e.g., POST /checkout/premium).
 * 2. Define secure webhook routes for external APIs (e.g., POST /webhook).
 * 3. Attach Authentication Middleware (requireAuth) so we know who is paying.
 * 4. Attach Validation Middleware (DTOs) to check requested items.
 * * CRITICAL RULE: A Route file must NEVER contain business logic, database 
 * calls, or HTTP response formatting. It is strictly a "wiring" file.
 */