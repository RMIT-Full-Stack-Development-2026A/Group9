/**
 * ============================================================================
 * ROOT APPLICATION COMPONENT (The "Toang" Engine)
 * ============================================================================
 * Location: src/App.jsx
 * * 🎯 CORE PRINCIPLE:
 * This is the entry point of the React component tree. Its primary job is to
 * wrap the entire application in the necessary "Context Providers" (Auth, Theme, 
 * Toast) and initialize the global routing system.
 * * * FEATURES INCLUDED:
 * 1. Global State: Wraps the app in AuthProvider to manage player sessions.
 * 2. Routing: Renders the AppRouter which handles all page transitions.
 * 3. Base Styles: Imports global.css and variables.css to apply the theme.
 * 4. Error Boundary: (Optional/Suggested) Prevents a single "Toang" from crashing the app.
 */