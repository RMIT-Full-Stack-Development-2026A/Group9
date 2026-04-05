/**
 * ============================================================================
 * USER SERVICE (The Profile & Identity Logic)
 * ============================================================================
 * Purpose: This file contains the core business logic for managing users in 
 * TicTacToang. It acts as the "Brain" for account-related operations, 
 * coordinating between the User Repository and other modules like Leaderboard.
 * * Key Responsibilities:
 * 1. Business Validation: Ensuring usernames aren't offensive or taken.
 * 2. Profile Management: Handling the logic for updating bio, avatars, or settings.
 * 3. XP & Leveling: Logic to check if a user should "Level Up" after a game.
 * 4. Privacy: Filtering sensitive data (like emails) from public profile views.
 * * CRITICAL RULE: The Service layer never touches the 'req' or 'res' objects. 
 * It receives clean data from the Controller and returns Objects or Errors.
 */