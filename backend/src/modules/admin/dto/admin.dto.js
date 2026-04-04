/**
 * ============================================================================
 * ADMIN DTO (Data Transfer Object / The Inspector)
 * ============================================================================
 * Purpose: This file defines the exact "shape" and rules for incoming data. 
 * Before the Controller even looks at a request, a Validation Middleware uses 
 * these DTO schemas to inspect the data (req.body, req.query, or req.params).
 * If the data is missing, the wrong type, or malicious, the request is 
 * immediately rejected with a 400 Bad Request error.
 * * * Typical Libraries used here: Zod, Joi, or express-validator.
 * * * Key Responsibilities:
 * 1. Define required vs. optional fields.
 * 2. Enforce data types (e.g., 'page' must be a Number, not a String).
 * 3. Enforce constraints (e.g., 'reason' must be at least 10 characters long).
 * * * CRITICAL RULE: A DTO only checks the FORMAT of the data, not the TRUTH 
 * of the data. For example, the DTO checks if an email looks like an email, 
 * but the Service layer checks if that email actually exists in the database.
 */