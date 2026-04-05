/**
 * ============================================================================
 * GLOBAL VALIDATORS (The Shared Inspector)
 * ============================================================================
 * Purpose: While DTOs (Data Transfer Objects) validate the "Shape" of a 
 * request, this file contains reusable "Validation Rules" for the entire 
 * TicTacToang backend. It ensures that common patterns (like User IDs or 
 * Board Indices) are checked consistently across every module.
 * * Key Responsibilities:
 * 1. Reusability: Defining a "Single Source of Truth" for complex Regex patterns.
 * 2. Sanity Checks: Validating that a Move position is between 0-8.
 * 3. Identity Checks: Verifying that a string is a valid MongoDB ObjectId.
 * * CRITICAL RULE: These are "Pure Functions." They should take a value, 
 * return true/false (or throw an error), and never touch the database.
 */