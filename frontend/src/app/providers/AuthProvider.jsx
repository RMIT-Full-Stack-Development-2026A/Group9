/**
 * ============================================================================
 * PROTECTED ROUTE COMPONENT (The Security Gatekeeper)
 * ============================================================================
 * Location: src/shared/components/ProtectedRoute/ProtectedRoute.jsx
 * * 🎯 CORE PRINCIPLE:
 * This component acts as a wrapper for routes that require a player to be 
 * logged in (e.g., Play, Profile, Store). If a guest tries to access a 
 * restricted "Toang" area, they are automatically redirected to the Login page.
 * * * FEATURES INCLUDED:
 * 1. Auth Detection: Checks the global AuthProvider state.
 * 2. Role-Based Access: Optionally restricts routes to specific roles (e.g., ADMIN).
 * 3. Loading Resilience: Waits for the initial session check to finish.
 * 4. UX Preservation: Saves the intended URL to redirect the user back after login.
 */