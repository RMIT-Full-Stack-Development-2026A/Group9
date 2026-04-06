/**
 * ============================================================================
 * ADMIN CONTROLLER (The Receptionist / Traffic Cop)
 * ============================================================================
 * Purpose: This file handles incoming HTTP requests specifically for the 
 * Admin module. It acts as the bridge between the Express Routes and the 
 * underlying Business Logic (Admin Service).
 * * Key Responsibilities:
 * 1. Extract data from the request (req.body, req.params, req.query, req.auth).
 * 2. Pass that clean data to the AdminService.
 * 3. Receive the result from the Service.
 * 4. Send the appropriate HTTP response (status codes like 200, 201) back to the client.
 * 5. Catch any errors and pass them to the global error middleware via next(error).
 * * CRITICAL RULE: A Controller should NEVER contain complex business rules, 
 * math, or database queries. It strictly manages the HTTP input/output flow.
 */

// Implementation contract:
// 1) Export route handlers only (no DB calls directly in this layer).
// 2) Validate input through DTO/middleware, then delegate to service.
// 3) Always forward failures to next(error) for global error handling.