/**
 * ============================================================================
 * HTTP HELPER (The Communication Backbone)
 * ============================================================================
 * Location: src/shared/utils/http.helper.js
 * Purpose: A standardized wrapper around Axios for all API interactions in 
 * the TicTacToang ecosystem. It centralizes authentication headers, 
 * base URL configuration, and global error handling.
 * * Key Responsibilities:
 * 1. Base Configuration: Setting the root API endpoint for the "Modular Monolith".
 * 2. Request Interception: Automatically injecting JWT tokens into every request.
 * 3. Response Interception: Handling 401 (Unauthorized) errors globally.
 * 4. Error Normalization: Flattening Axios error objects for easier UI consumption.
 */