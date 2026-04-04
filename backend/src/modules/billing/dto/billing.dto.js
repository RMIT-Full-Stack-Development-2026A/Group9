/**
 * ============================================================================
 * BILLING DTO (Data Transfer Object / The Financial Inspector)
 * ============================================================================
 * Purpose: This file defines the strict validation rules for any data entering 
 * the Billing module from the frontend. Because this module deals with money, 
 * strict validation is absolutely critical to prevent malicious users from 
 * manipulating prices, plans, or quantities.
 * * Key Responsibilities:
 * 1. Validate checkout requests (e.g., Ensure they are asking for a valid plan).
 * 2. Validate query parameters for fetching transaction history.
 * * CRITICAL RULE: Webhooks (like Stripe's payment confirmation) do NOT use 
 * DTOs. Webhooks send raw data that must be cryptographically verified by the 
 * Service layer using a secret key, not structurally validated by a DTO!
 */