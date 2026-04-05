/**
 * ============================================================================
 * PAYMENT SERVICE (The Transaction Logic)
 * ============================================================================
 * Location: src/modules/payment/services/payment.service.js
 * Purpose: This service handles the business logic for financial operations
 * within the TicTacToang ecosystem. It communicates with the backend to 
 * authorize purchases of skins, XP boosts, and season passes.
 * * Key Responsibilities:
 * 1. Transaction Creation: Sending payment intents to the server.
 * 2. History Retrieval: Fetching a player's past "Toang" store purchases.
 * 3. Data Masking: Ensuring sensitive card data is never logged locally.
 * 4. Receipt Generation: Formatting transaction data for the UI.
 */