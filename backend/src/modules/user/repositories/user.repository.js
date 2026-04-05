/**
 * ============================================================================
 * USER REPOSITORY (The Identity Data Vault)
 * ============================================================================
 * Purpose: This file is the only place in the "User" module that speaks 
 * directly to the MongoDB database. It performs the actual CRUD (Create, Read, 
 * Update, Delete) operations on the User collection for TicTacToang.
 * * Key Responsibilities:
 * 1. Data Retrieval: Finding users by ID, Email, or Username.
 * 2. Data Persistence: Saving new users and updating existing profile stats.
 * 3. Atomic Updates: Incrementing wins/losses/XP safely without race conditions.
 * * CRITICAL RULE: This file should NEVER contain business logic (e.g., 
 * "Is this username offensive?"). It only executes the query and returns 
 * the raw database document.
 */