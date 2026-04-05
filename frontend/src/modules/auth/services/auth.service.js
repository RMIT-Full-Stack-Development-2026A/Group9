/**
 * ============================================================================
 * AUTH SERVICE (The API Communicator)
 * ============================================================================
 * Location: src/modules/auth/services/auth.service.js
 * Purpose: This file acts as the bridge between your React application and 
 * the TicTacToang Backend API. It encapsulates all HTTP logic so your 
 * components don't have to deal with URLs, Headers, or status codes.
 * * Key Responsibilities:
 * 1. Endpoint Mapping: Centralizing all auth-related URL paths.
 * 2. Data Serialization: Sending login/register payloads to the server.
 * 3. Token Management: Providing helper methods to fetch the current user.
 * 4. Error Propagation: Passing raw axios/fetch errors to the hooks.
 */