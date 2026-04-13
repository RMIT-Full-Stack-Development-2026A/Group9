import { useState } from "react";
import { login } from "../services/auth.service";

export const useLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (payload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await login(payload);
      // Optionally update global auth state here
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