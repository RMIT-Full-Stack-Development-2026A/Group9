/**
 * ============================================================================
 * BILLING SERVICE (The Financial Core / Logic Layer)
 * ============================================================================
 * Purpose: This file handles the complex business logic for all money-related 
 * operations. It acts as the intermediary between your server and external 
 * payment gateways (like Stripe or PayPal), while ensuring your database 
 * stays perfectly in sync with the user's actual financial status.
 * * Key Responsibilities:
 * 1. Communicate with external Payment APIs (e.g., Stripe SDK).
 * 2. Enforce business rules (e.g., "Cannot subscribe if already Premium").
 * 3. Cryptographically verify webhook events to prevent payment fraud.
 * 4. Instruct the Repository to save receipts and update user roles.
 * * CRITICAL RULE: The Service layer NEVER knows about HTTP requests or 
 * responses. It receives pure data, performs financial operations, and 
 * either returns the result or throws a clear AppError if something fails.
 */

// Implementation contract:
// 1) Keep gateway integration here; repositories only persist transaction state.
// 2) Make payment flows idempotent and auditable.
// 3) Return normalized transaction objects for DTO/response mapping layers.