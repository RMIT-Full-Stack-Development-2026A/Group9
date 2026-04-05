/**
 * ============================================================================
 * PROFILE MODULE ENTRY POINT (The Identity Gateway)
 * ============================================================================
 * Location: src/modules/profile/index.js
 * Purpose: This file acts as the public interface for the Profile module.
 * It follows the "Barrel Export" pattern to ensure that external modules
 * (like Pages or App Providers) interact with user identity through a 
 * controlled set of tools.
 * * Key Responsibilities:
 * 1. Component Export: Making the ProfileCard available for the user dashboard.
 * 2. Hook Export: Providing useProfile for managing identity state and updates.
 * 3. Service Export: Exposing profileService for validation and data formatting.
 * 4. Encapsulation: Shielding internal CSS and logic from the rest of the app.
 */