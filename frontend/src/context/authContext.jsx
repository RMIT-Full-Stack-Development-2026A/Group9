import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUserContext,
  getStoredUser,
  hasToken,
  login as loginRequest,
  logout as logoutRequest,
} from "../pages/Login/Login.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!hasToken()) {
        setUser(null);
        setIsBootstrapping(false);
        return;
      }

      try {
        const profile = await getCurrentUserContext();
        setUser(profile);
      } catch {
        await logoutRequest();
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isBootstrapping,
      async login(identifier, password) {
        try {
          const loggedInUser = await loginRequest(identifier, password);
          setUser(loggedInUser);
          return { success: true, user: loggedInUser };
        } catch (error) {
          return { success: false, message: error.message || "Sign in failed" };
        }
      },
      async logout() {
        await logoutRequest();
        setUser(null);
      },
      async refreshUser() {
        if (!hasToken()) {
          setUser(null);
          return null;
        }

        try {
          const profile = await getCurrentUserContext();
          setUser(profile);
          return profile;
        } catch {
          await logoutRequest();
          setUser(null);
          return null;
        }
      },
    }),
    [user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
