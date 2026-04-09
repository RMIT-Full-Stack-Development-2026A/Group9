/**
 * ============================================================================
 * USE ADMIN HOOK (The Overlord Controller)
 * ============================================================================
 * Location: src/modules/admin/hooks/useAdmin.js
 * Purpose: This hook manages the state and actions for the Admin Dashboard.
 * It provides the real-time data flow for server metrics and user moderation.
 * * Key Responsibilities:
 * 1. Metrics Sync: Fetching live stats (Active Games, Online Users).
 * 2. Audit Logs: Tracking recent administrative actions and system events.
 * 3. Moderation Actions: Handling user bans and broadcasting system messages.
 * 4. Permission Guard: (Internal) Ensuring only authorized admins can trigger actions.
 */