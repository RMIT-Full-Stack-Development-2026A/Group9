/**
 * ============================================================================
 * USE PROFILE HOOK (The Identity Controller)
 * ============================================================================
 * Location: src/modules/profile/hooks/useProfile.js
 * Purpose: This hook manages the state and logic for viewing and updating
 * player profiles. It coordinates data fetching for both the current user 
 * and other players (for public profile views).
 * * Key Responsibilities:
 * 1. Data Fetching: Loading detailed user profiles and match history.
 * 2. Update Logic: Handling profile edits (avatar, username, bio).
 * 3. State Management: Managing loading, success, and error states.
 * 4. Permission Check: Determining if the viewer has "Edit" rights.
 */