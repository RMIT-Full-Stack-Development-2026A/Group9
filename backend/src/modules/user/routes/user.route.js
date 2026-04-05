/**
 * ============================================================================
 * USER ROUTER (The Identity Map)
 * ============================================================================
 * Purpose: This file defines the API endpoints for managing user profiles, 
 * accounts, and settings in TicTacToang. It acts as the gateway between 
 * the frontend "Profile" screen and the backend User Controller.
 * * Key Responsibilities:
 * 1. Define Public Routes: Accessing public player stats or search.
 * 2. Define Private Routes: Managing the logged-in user's own data (JWT required).
 * 3. Attach Middleware: Validation (DTOs) and Authentication (requireAuth).
 * * CRITICAL RULE: This router is strictly for account and profile management. 
 * Authentication logic (Login/Register) is usually handled in a separate 
 * 'auth.route.js' to keep the "User" module focused on profile data.
 */