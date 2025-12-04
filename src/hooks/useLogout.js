import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import authService from "../services/authService";
import axios from "axios";

export default function useLogout() {
  
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout: contextLogout } = useAuth();

  const handleLogout = async (endPoint = null) => {
    setIsLoading(true);
    try {
      if (endPoint) {
        try {
          await axios.post(endPoint);
        } catch (error) {
          console.warn("Backend logout failed, clearing tokens anyway", error);
        }
      }
      authService.clearTokens();
      contextLogout();
      setIsAuthenticated(true)
      navigate("/auth/login");
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      authService.clearTokens();
      contextLogout();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { logout: handleLogout, isLoading };
}
