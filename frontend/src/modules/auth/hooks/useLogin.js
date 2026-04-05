/**
 * ============================================================================
 * USE LOGIN HOOK (The Auth Orchestrator)
 * ============================================================================
 * Location: src/modules/auth/hooks/useLogin.js
 * Purpose: This custom hook encapsulates the business logic for logging in.
 * It bridges the gap between the UI (LoginForm) and the API (authService).
 * * Key Responsibilities:
 * 1. State Orchestration: Tracking 'isSubmitting' and 'error' status.
 * 2. Auth Integration: Updating the Global AuthProvider state upon success.
 * 3. Persistence: Ensuring the JWT is stored safely after a login.
 * 4. Error Normalization: Turning complex API errors into user-friendly strings.
 */