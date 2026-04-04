/**
 * ============================================================================
 * BILLING MODULE INDEX (The Public API / Export Hub)
 * ============================================================================
 * Purpose: This file serves as the strict "front door" for the entire Billing 
 * module. It defines what parts of the billing logic are visible to the rest 
 * of the application (like the Auth or Admin modules).
 * * This enforces the "Modular" part of our Modular Monolith.
 * * Key Responsibilities:
 * 1. Export the Router: For the Master Router (src/modules/index.js) to find.
 * 2. Export Shared Services: If the Auth module needs to check if a user's 
 * payment is valid before granting access, it calls the Service via this file.
 * * CRITICAL RULE: Never export the Transaction Model or Repository from here. 
 * Other modules should only interact with Billing through its Service functions.
 */