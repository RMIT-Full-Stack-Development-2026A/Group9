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

import { API_BASE_URL, AUTH_TOKEN_KEY } from "../../config/api.config.js";

//injects JWS token into headers automatically
const normalizeHeaders = (headers = {}) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
    };
};

//core request wrapper using native fetch api
 
const request = async (url, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: normalizeHeaders(options.headers),
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message =
            typeof payload === "object" && payload?.message
                ? payload.message
                : `Request failed with status ${response.status}`;

        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
};

// export 'httpHelper' object to match api.js import
export const httpHelper = {
    get: (url, options) => 
        request(url, { ...options, method: "GET" }),

    post: (url, data, options) => 
        request(url, { ...options, method: "POST", body: JSON.stringify(data) }),
    
    put: (url, data, options) => 
        request(url, { ...options, method: "PUT", body: JSON.stringify(data) }),
    
    patch: (url, data, options) => 
        request(url, { ...options, method: "PATCH", body: JSON.stringify(data) }),
    
    del: (url, options) => 
        request(url, { ...options, method: "DELETE" }),
};

export default httpHelper;