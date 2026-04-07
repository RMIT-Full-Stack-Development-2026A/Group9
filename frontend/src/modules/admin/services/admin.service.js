/**
 * ============================================================================
 * ADMIN SERVICE (The Overlord Logic)
 * ============================================================================
 * Location: src/modules/admin/services/admin.service.js
 * Purpose: This service manages the high-level administrative operations for 
 * the TicTacToang platform. It bridges the gap between the Moderator UI 
 * and the sensitive backend management endpoints.
 * * Key Responsibilities:
 * 1. Metrics Aggregation: Fetching real-time server and player statistics.
 * 2. Moderation Tools: Managing player bans, warnings, and account status.
 * 3. Global Communication: Sending system-wide broadcast messages via sockets.
 * 4. Audit Logging: Providing a history of administrative actions for accountability.
 */

import { http } from "../../../shared/utils/http.helper.js";
