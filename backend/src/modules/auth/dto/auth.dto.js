/**
 * ============================================================================
 * AUTH DTO (Data Transfer Object / The Inspector)
 * ============================================================================
 * Purpose: This file defines the strict validation rules for any data entering 
 * the Authentication module from the frontend. It acts as the first line of 
 * defense against malformed data, typos, and malicious injection attacks.
 * * Key Responsibilities:
 * 1. Validate Registration data (Ensure passwords are strong, emails are valid).
 * 2. Validate Login data (Ensure neither field is left blank).
 * 3. Standardize error messages sent back to the user if they make a mistake.
 * * CRITICAL RULE: A DTO only checks the FORMAT (Syntax) of the data, never 
 * the TRUTH (Semantics). It checks if an email *looks* valid (user@mail.com), 
 * but the Service layer checks if that email is actually *registered*.
 */