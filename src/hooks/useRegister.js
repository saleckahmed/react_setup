import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import authService from "../services/authService";

export default function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (endPoint, data, navigateUrl) => {
    setIsLoading(true);
    try {
      const res = await apiPost(endPoint, data);

      if (res?.status === 201 || res?.status === 200) {
        const { access, refresh, expires_in } = res.data;
        authService.setTokens(access, refresh, expires_in || 3600);
        login(res.data.user || null);
        toast.success("Registration successful!");
        navigate(navigateUrl);
      }
      return res;
    } catch (err) {
      let errorMessage = "Registration failed";

      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.email?.[0]) {
        errorMessage = err.response.data.email[0];
      } else if (err.response?.data?.password?.[0]) {
        errorMessage = err.response.data.password[0];
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

  return { register: handleRegister, isLoading };
}
