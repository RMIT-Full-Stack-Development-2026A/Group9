/**
 * ============================================================================
 * ADMIN MODULE INDEX (The Public API / Export Hub)
 * ============================================================================
 * Purpose: This file serves as the strict "front door" for the entire Admin 
 * module. It controls exactly what is allowed to leave this folder and be 
 * used by the rest of the application. 
 * * This enforces the concept of "Encapsulation" in a Modular Monolith.
 * * Key Responsibilities:
 * 1. Export the Router: So the Master Router (src/modules/index.js) can mount it.
 * 2. Export Shared Services: If the Game module needs to ask the Admin module 
 * a question (e.g., "Is this user banned?"), it imports the function from 
 * here, NOT by digging deep into the admin/services folder.
 * * CRITICAL RULE: NEVER export a Repository or a Model from this file. 
 * If another module interacts directly with your database models, it breaks 
 * the modular architecture and creates spaghetti code!
 */

// --- Example 1: Exporting the Router (Required) ---
// This is the most important export. The Master Router needs this to 
// connect the admin URLs to the actual code.
//
// export { default as adminRoutes } from './routes/admin.route.js';

// --- Example 2: Exporting Public Services (Optional) ---
// Imagine the `users` module wants to know if a user is currently banned 
// before letting them log in. We expose a specific, safe function for 
// other modules to use without exposing how the database works.
//
// export { checkUserBanStatus } from './services/admin.service.js';

// --- Example 3: Exporting Constants or Enums (Optional) ---
// If the Admin module defines specific ban reason codes that the frontend 
// or other modules need to know about.
//
// export const ADMIN_BAN_REASONS = {
//   CHEATING: 'cheating',
//   TOXICITY: 'toxicity',
//   PAYMENT_FRAUD: 'payment_fraud'
// };

/**
 * How other files use this:
 * * BAD (Breaking Encapsulation):
 * import { checkUserBanStatus } from '../admin/services/admin.service.js';
 * * GOOD (Using the Public API):
 * import { checkUserBanStatus } from '../admin';
 */