import { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.init();
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    authService.clearTokens();
  }, []);

  // Login function to update context
  const login = useCallback((userData = null) => {
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    setIsAuthenticated,
    setUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;