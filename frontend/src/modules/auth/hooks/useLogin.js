/*
  useLogin.js
  - Small hook to encapsulate login submission state and error handling.
  - Keeps form components thin by providing `handleLogin` that returns
    the server response and manages `isSubmitting` / `error` flags.
  - Design note: The hook does NOT mutate global auth context; the
    caller (LoginForm) is responsible for invoking `login` from
    `AuthProvider` after successful authentication to centralize state.
*/

import { useState } from "react";
import { login } from "../services/auth.service";

export const useLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // `handleLogin` returns the raw data from `auth.service.login`. The
  // consumer can inspect `accessToken` / `user` fields and perform
  // subsequent actions (profile fetch, redirect, etc.).
  const handleLogin = async (payload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await login(payload);
      // Do not update global auth state here — keep this hook focused on
      // the HTTP interaction. The page/component can decide how to apply
      // the returned token/user (e.g., call AuthContext.login).
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleLogin, isSubmitting, error };
};