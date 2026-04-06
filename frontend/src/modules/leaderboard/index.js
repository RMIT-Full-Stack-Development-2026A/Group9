/**
 * ============================================================================
 * LEADERBOARD MODULE ENTRY POINT (The Hall of Fame Gateway)
 * ============================================================================
 * Location: src/modules/leaderboard/index.js
 * Purpose: This file serves as the public "Contract" for the Leaderboard 
 * module. It ensures that the rest of the application interacts with 
 * player rankings through a standardized interface.
 * * Key Responsibilities:
 * 1. Component Export: Providing the LeaderboardTable for the Rankings page.
 * 2. Hook Export: Exposing useLeaderboard for data fetching and refreshing.
 * 3. Service Export: Providing leaderboardService for tier and XP logic.
 * 4. Architecture: Maintaining a clean separation between UI and business logic.
 */

export { default as LeaderboardTable } from "./components/LeaderboardTable/LeaderboardTable.jsx";

export { default as useLeaderboard } from "./hooks/useLeaderboard.js";

export * as leaderboardService from "./services/leaderboard.service.js";