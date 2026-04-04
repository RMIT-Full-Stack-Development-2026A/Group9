/**
 * ============================================================================
 * AUTH ROUTER (The Map / Directory)
 * ============================================================================
 * Purpose: This file defines the actual URLs (endpoints) for the Authentication 
 * module. It connects a specific HTTP Method (POST, GET) and a URL path to the 
 * correct Auth Controller function. It also applies necessary security Bouncers 
 * (Middleware) before the request is allowed to reach the Controller.
 * * Key Responsibilities:
 * 1. Define public routes (e.g., POST /register, POST /login).
 * 2. Define protected routes (e.g., GET /me, POST /logout).
 * 3. Attach Data Validation Middleware (DTOs) to check incoming request bodies.
 * 4. Attach Security Middleware (e.g., requireAuth) where necessary.
 * * CRITICAL RULE: A Route file must NEVER contain business logic, hashing, 
 * database calls, or HTTP response formatting. It is strictly a "wiring" file 
 * that directs traffic.
 */