/**
 * ============================================================================
 * USER DTO (Data Transfer Object / The Identity Guard)
 * ============================================================================
 * Purpose: This file ensures that any data entering the "User" module is 
 * clean, safe, and formatted correctly. Before we update a profile or 
 * search for a player, the DTO validates the request to protect our 
 * database and maintain data integrity.
 * * Key Responsibilities:
 * 1. Sanitization: Trimming whitespace from usernames and emails.
 * 2. Format Enforcement: Ensuring emails look like emails and usernames 
 * follow TicTacToang's character rules.
 * 3. Security: Removing any extra fields a user might try to "inject" 
 * (like trying to set their own 'role' to 'admin').
 * * CRITICAL RULE: The DTO is a "Filter." It doesn't check if the user 
 * exists in the database; it only checks if the *request* is valid.
 */