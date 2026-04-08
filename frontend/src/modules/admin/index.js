/**
 * ============================================================================
 * ADMIN MODULE ENTRY POINT (The Overlord Gateway)
 * ============================================================================
 * Location: src/modules/admin/index.js
 * Purpose: This file serves as the centralized export hub for the Admin module.
 * It provides the necessary tools for system-wide monitoring and moderation
 * while keeping the "Toang" administrative logic isolated from the player UI.
 * * Key Responsibilities:
 * 1. Component Export: Making the AdminDashboard available for the Admin page.
 * 2. Hook Export: Providing useAdmin for managing metrics and broadcast state.
 * 3. Service Export: Exposing adminService for low-level moderation API calls.
 * 4. Access Control: Acts as the boundary for sensitive moderation logic.
 */

export { default as AdminDashboard } from "./components/AdminDashboard/AdminDashboard.jsx";

export { default as useAdmin } from "./hooks/useAdmin.js";

export * as adminService from "./services/admin.service.js";