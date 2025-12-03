import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import authService from "../services/authService";

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (endPoint, data, navigateUrl) => {
    setIsLoading(true);
    try {
      const res = await axios.post(endPoint, data);

      if (res?.status === 200) {
        const { access, refresh, expires_in } = res.data;

        // Store tokens using authService
        authService.setTokens(access, refresh, expires_in || 3600);

        // Update auth context
        login(res.data.user || null);

        // Show success message
        toast.success("Login successful!");

        // Navigate to dashboard or specified URL
        navigate(navigateUrl);
      }

      return res;
    } catch (err) {
      // Extract error message from different response formats
      let errorMessage = "Login failed";
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.non_field_errors?.[0]) {
        errorMessage = err.response.data.non_field_errors[0];
      } else if (typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error(errorMessage);
      toast.error(errorMessage);
      return err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login: handleLogin, isLoading };
}