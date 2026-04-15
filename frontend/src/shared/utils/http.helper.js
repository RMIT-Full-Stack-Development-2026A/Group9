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

import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../config/api.config.js";

const http = axios.create({ baseURL: API_BASE_URL });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  console.log("[HTTP HELPER] Token in localStorage:", token);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[HTTP HELPER] Authorization header set:", config.headers.Authorization);
  } else {
    console.log("[HTTP HELPER] No token found, Authorization header not set.");
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem("token");
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem("user");
      // Only redirect if not already on /login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Provide both named and default exports to be drop-in compatible
export { http };
export const httpHelper = http;
export default http;