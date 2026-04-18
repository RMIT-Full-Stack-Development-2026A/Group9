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
import httpHelper from "../../../shared/utils/http.helper.js";
import { errorMessages } from "../../../shared/utils/validators.js";

export const login = async (payload) => {
  const response = await httpHelper.post("/api/auth/login", payload);
  const accessToken = response?.data?.accessToken;
  if (accessToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  }
  const user = response?.data?.user;
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
  return response.data;
};

export const getMe = async () => {
  return httpHelper("/auth/me", {
    method: "GET",
  });
};

export const registerPlayer = async (submitData) => {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${apiBase}/api/auth/register`, {
      method: 'POST',
      body: submitData,
    });

    const data = await response.json();

    if (!response.ok) {
      // Use centralized error messages from validators.js
      if (data && data.message) {
        let errObj = errorMessages.unknown;
        if (data.message === errorMessages.emailAlreadyRegistered.error) {
          errObj = errorMessages.emailAlreadyRegistered;
        } else if (data.message === errorMessages.invalidRegisterPayload.error) {
          errObj = errorMessages.invalidRegisterPayload;
        } else if (data.message.toLowerCase().includes('password')) {
          errObj = errorMessages.weakPassword;
        } else if (data.message === errorMessages.invalidUsername.error) {
          errObj = errorMessages.invalidUsername;
        } else if (data.message === errorMessages.invalidEmail.error) {
          errObj = errorMessages.invalidEmail;
        } else if (data.message === errorMessages.duplicateUsername.error) {
          errObj = errorMessages.duplicateUsername;
        } else if (data.message === errorMessages.missingFields.error) {
          errObj = errorMessages.missingFields;
        } else if (data.message === errorMessages.invalidAvatar.error) {
          errObj = errorMessages.invalidAvatar;
        }
        // If backend provides details, override cause
        if (data.details) errObj = { ...errObj, cause: data.details };
        throw [errObj];
      }
      throw data.errors || [errorMessages.unknown];
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

export const logout = async () => {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(AUTH_USER_KEY);

	return { success: true };
};