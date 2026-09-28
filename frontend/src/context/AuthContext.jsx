import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // -----------------------------------------
  // Get saved user when app starts
  // -----------------------------------------
  const [user, setUser] = useState(() => {
    return authService.getCurrentUser();
  });

  // -----------------------------------------
  // Login
  // -----------------------------------------
  const login = async (email, password) => {
    const response = await authService.login(
      email,
      password
    );

    setUser(response.user);

    return response;
  };

  // -----------------------------------------
  // Logout
  // -----------------------------------------
  const logout = () => {
    authService.logout();

    setUser(null);
  };

  // -----------------------------------------
  // Context value
  // -----------------------------------------
  const value = useMemo(
    () => ({
      user,

      isAuthenticated:
        Boolean(user) &&
        authService.isAuthenticated(),

      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// -----------------------------------------
// Custom hook
// -----------------------------------------

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}