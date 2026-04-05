/**
 * ============================================================================
 * USER CONTROLLER (The Profile & Account Receptionist)
 * ============================================================================
 * Purpose: This file manages HTTP requests related to user accounts, 
 * profiles, and authentication state in TicTacToang. It acts as the 
 * bridge between the Client (Frontend) and the User Service.
 * * Key Responsibilities:
 * 1. Profile Retrieval: GET requests for a user's own data or public profiles.
 * 2. Account Updates: PATCH requests to change usernames or settings.
 * 3. Stats Integration: Displaying a summary of wins/losses/XP.
 * * CRITICAL RULE: The Controller should never talk to the Database 
 * directly. It extracts the User ID from the JWT (Request) and hands 
 * it to the Service.
 */