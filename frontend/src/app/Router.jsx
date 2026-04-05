/**
 * ============================================================================
 * MAIN ROUTER CONFIGURATION (The Navigation Map)
 * ============================================================================
 * Location: src/app/routes/Router.jsx
 * * 🎯 CORE PRINCIPLE:
 * This is the central nervous system for TicTacToang's navigation. It defines 
 * the URL structure, applies security guards (ProtectedRoutes), and 
 * implements "Lazy Loading" to ensure the game remains fast and responsive.
 * * * FEATURES INCLUDED:
 * 1. Code Splitting: Modules are loaded only when the player visits the page.
 * 2. Layout Wrapping: Consistent Navbar/Footer across different "Toang" views.
 * 3. Security Integration: Uses ProtectedRoute to gatekeep sensitive areas.
 * 4. Fallback Logic: Handles 404 (Not Found) errors gracefully.
 */