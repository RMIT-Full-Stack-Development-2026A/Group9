/**
 * ============================================================================
 * BILLING REPOSITORY (The Vault Manager / Data Access Layer)
 * ============================================================================
 * Purpose: This file is the ONLY place in the Billing module allowed to talk 
 * directly to the database (MongoDB/Mongoose) regarding financial records. 
 * It abstracts away the Mongoose queries so the Service layer doesn't have 
 * to know exactly how data is stored on the hard drive.
 * * Key Responsibilities:
 * 1. Save new transaction receipts to the database.
 * 2. Fetch billing history for a specific user.
 * 3. Ensure idempotency (preventing the same payment from being saved twice).
 * * CRITICAL RULE: A Repository must NEVER contain business rules (e.g., it 
 * shouldn't calculate taxes or check if a user is already premium) and NEVER 
 * know about HTTP. It simply executes the queries the Service asks for.
 */

// Implementation contract:
// 1) Keep payment persistence idempotent via unique transaction references.
// 2) Never compute business totals here; only store/retrieve raw financial data.
// 3) Expose focused query functions with predictable names.