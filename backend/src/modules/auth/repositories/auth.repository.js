/**
 * ============================================================================
 * AUTH REPOSITORY (The Vault Manager / Data Access Layer)
 * ============================================================================
 * Purpose: This file is the ONLY place in the Authentication module allowed to 
 * talk directly to the database (MongoDB/Mongoose). It abstracts away the 
 * Mongoose queries so the Service layer doesn't have to know how data is stored.
 * * Key Responsibilities:
 * 1. Execute CRUD operations specifically for user authentication.
 * 2. Return raw database objects back to the Service layer.
 * * CRITICAL RULE: A Repository must NEVER contain business rules (e.g., it 
 * shouldn't check if a password matches) and NEVER know about HTTP. It simply 
 * executes the queries the Service asks for.
 */