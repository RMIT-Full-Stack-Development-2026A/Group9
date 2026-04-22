export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

export const AUTH_TOKEN_KEY = "authToken";
export const AUTH_USER_KEY = "currentUser";
