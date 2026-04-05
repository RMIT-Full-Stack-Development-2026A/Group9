/**
 * ============================================================================
 * HOME MODULE ENTRY POINT (The Lobby Gateway)
 * ============================================================================
 * Location: src/modules/home/index.js
 * Purpose: This file acts as the single point of contact for the Home module.
 * It follows the "Barrel Export" pattern to keep the rest of the app 
 * decoupled from the internal folder structure of the Lobby.
 * * Key Responsibilities:
 * 1. Component Export: Making the HomeContent available for the main Home Page.
 * 2. Hook Export: Providing useHome for components that need lobby logic.
 * 3. Service Export: Exposing homeService for rank and XP calculations.
 * 4. Encapsulation: Ensuring CSS modules and private helpers stay internal.
 */