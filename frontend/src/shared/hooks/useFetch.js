/**
 * ============================================================================
 * USE FETCH HOOK (The Data Lifeline)
 * ============================================================================
 * Location: src/shared/hooks/useFetch.js
 * Purpose: A highly reusable, generic hook for handling asynchronous data 
 * fetching across the TicTacToang application. It encapsulates the repetitive
 * logic of loading states, error handling, and manual re-fetching.
 * * Key Responsibilities:
 * 1. State Management: Tracks data, loading status, and error messages.
 * 2. Automatic Fetching: Optionally triggers an API call on component mount.
 * 3. Manual Refresh: Provides a function to re-trigger the request (e.g., Pull-to-refresh).
 * 4. Dependency Tracking: Re-runs the effect if the provided dependencies change.
 */