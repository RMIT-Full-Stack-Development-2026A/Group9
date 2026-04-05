/**
 * ============================================================================
 * ROLES & PERMISSIONS (The Access Control List)
 * ============================================================================
 * Purpose: This file defines the "Hierarchy of Power" in TicTacToang. It 
 * separates standard players from moderators and administrators, ensuring 
 * that only authorized users can perform sensitive actions like banning 
 * players or resetting the leaderboard.
 * * Key Responsibilities:
 * 1. Role Definitions: Enum-like constants for User, Moderator, and Admin.
 * 2. Permission Mapping: Defining exactly what each role is allowed to do.
 * 3. Middleware Helpers: Providing logic for 'checkRole' functions.
 * * CRITICAL RULE: This file is the "Law" of the application. Roles should 
 * be hardcoded here and referenced in your 'User' model and 'Routes'.
 */