/**
 * ============================================================================
 * AUTH SERVICE (The Brain / Security Core)
 * ============================================================================
 * Purpose: This file contains the absolute core business logic for Authentication. 
 * It is responsible for enforcing security rules, hashing passwords, comparing 
 * credentials, and generating JSON Web Tokens (JWTs).
 * * Key Responsibilities:
 * 1. Enforce business rules (e.g., "Passwords must be hashed before saving").
 * 2. Handle cryptography (bcrypt for passwords, jsonwebtoken for sessions).
 * 3. Coordinate with the AuthRepository to fetch or save user data.
 * * CRITICAL RULE: The Service layer knows NOTHING about HTTP. You will never 
 * see 'req', 'res', or 'status(200)' here. If a user provides a bad password, 
 * the Service throws an 'AppError' and trusts the Controller to catch it.
 */