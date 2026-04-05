/**
 * ============================================================================
 * VALIDATORS UTILITY (The Gatekeeper)
 * ============================================================================
 * Location: src/shared/utils/validators.js
 * Purpose: A centralized suite of validation logic for the TicTacToang 
 * ecosystem. It ensures that data entering our "Modular Monolith" is 
 * clean, safe, and consistent across all modules (Auth, Profile, Payment).
 * * Key Responsibilities:
 * 1. String Validation: Checking lengths and patterns for usernames/passwords.
 * 2. Format Verification: Validating emails and credit card patterns.
 * 3. Security: Preventing basic injection attempts or invalid characters.
 * 4. Error Mapping: Returning consistent error messages for the UI.
 */