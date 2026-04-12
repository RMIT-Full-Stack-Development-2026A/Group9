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

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../../config/api.config.js";
import { http } from "../../../shared/utils/http.helper.js";

export const login = async (payload) => {
	const data = await http("/auth/login", {
		method: "POST",
		body: JSON.stringify(payload),
	});

	if (data?.data?.accessToken) {
		localStorage.setItem(AUTH_TOKEN_KEY, data.data.accessToken);
	}

	if (data?.data?.user) {
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
	}

	return data;
};

export const registerPlayer = async (submitData) => {
  const apiBase = import.meta.env.VITE_API_URL || '';

  try {
    const response = await fetch(`${apiBase}/api/register`, {
      method: 'POST',
      body: submitData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Throw the backend errors so the hook can catch them
      throw data.errors || [{ error: 'Unknown Error' }];
    }
    
    return data;
  } catch (error) {
    // If it's already an array of errors from the backend, throw it forward
    if (Array.isArray(error)) throw error;
    
    // Otherwise, it's a network error
    throw [{ 
      error: 'Network Error', 
      cause: 'Could not reach the server.', 
      example: 'Check if backend is running.' 
    }];
  }
};

export const getMe = async () => {
	return http("/auth/me", {
		method: "GET",
	});
};

export const logout = async () => {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(AUTH_USER_KEY);

	return { success: true };
};