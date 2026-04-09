/**
 * ============================================================================
 * ADMIN REPOSITORY (The Vault Manager / Data Access Layer)
 * ============================================================================
 * Purpose: This file is the ONLY place in the Admin module allowed to talk 
 * directly to the database (MongoDB/Mongoose). It abstracts away the complex 
 * database query languages so the Service layer doesn't have to care about 
 * HOW the data is stored, only THAT it is stored.
 * * Key Responsibilities:
 * 1. Execute CRUD operations (Create, Read, Update, Delete) using Mongoose Models.
 * 2. Handle complex database aggregations or joins (e.g., .populate()).
 * 3. Return raw data back to the Service layer.
 * * CRITICAL RULE: A Repository must NEVER contain business rules (no "if user 
 * is banned, then...") and NEVER know about HTTP. It is a "dumb" worker that 
 * executes database queries exactly as the Service instructs it to.
 */

// Implementation contract:
// 1) Export read/write functions only (no DTO validation and no policy checks).
// 2) Return plain documents/rows; response shaping belongs to service/DTO layers.
// 3) Keep naming convention: find*, list*, create*, update*, delete*.