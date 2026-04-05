/**
 * ============================================================================
 * USE REGISTRATION HOOK (The Onboarding Specialist)
 * ============================================================================
 * Location: src/modules/auth/hooks/useRegistration.js
 * Purpose: This hook manages the logic for creating a new account. It handles
 * the transition from a "Guest" to an "Authenticated Player."
 * * Key Responsibilities:
 * 1. API Coordination: Sending registration data to the backend.
 * 2. Instant Auth: Automatically logging the user in upon successful signup.
 * 3. Navigation: Redirecting the new player to the Home or Profile page.
 * 4. Error Management: Capturing validation errors from the server.
 */