import { BASE_URL } from "../api/endPoints";
import { AUTH_ENDPOINTS } from "../api/endPoints";

const authService = {
  refreshTimer: null,
  isRefreshing: false,
  failedQueue: [],

  // Set tokens in storage with proper expiration calculation
  setTokens: (accessToken, refreshToken, expiresIn = 3600) => {
    if (!accessToken || !refreshToken) {
      console.error("Access token and refresh token are required");
      return;
    }

    const expiresAt = Date.now() + expiresIn * 1000;

    sessionStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("tokenExpiresAt", expiresAt.toString());

    // Schedule token refresh 5 minutes before expiration
    authService.scheduleTokenRefresh(expiresIn - 300);
  },

  // Get access token from storage
  getAccessToken: () => {
    return sessionStorage.getItem("accessToken");
  },

  // Get refresh token from storage
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const accessToken = authService.getAccessToken();
    return !!accessToken && !authService.isTokenExpired();
  },

  // Clear all tokens (logout)
  clearTokens: () => {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("tokenExpiresAt");

    if (authService.refreshTimer) {
      clearTimeout(authService.refreshTimer);
      authService.refreshTimer = null;
    }

    authService.isRefreshing = false;
    authService.failedQueue = [];

    // Redirect to login
    window.location.href = "/login";
  },

  // Schedule automatic token refresh
  scheduleTokenRefresh: (expiresIn) => {
    // Clear existing timer
    if (authService.refreshTimer) {
      clearTimeout(authService.refreshTimer);
    }

    // Convert seconds to milliseconds and schedule refresh
    if (expiresIn > 0) {
      authService.refreshTimer = setTimeout(() => {
        authService.refreshAccessToken();
      }, expiresIn * 1000);
    }
  },

  // Check if token is expired
  isTokenExpired: () => {
    const expiresAt = sessionStorage.getItem("tokenExpiresAt");
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt);
  },

  // Refresh access token using refresh token
  refreshAccessToken: async () => {
    // Prevent multiple simultaneous refresh requests
    if (authService.isRefreshing) {
      return new Promise((resolve, reject) => {
        authService.failedQueue.push({ resolve, reject });
      });
    }

    authService.isRefreshing = true;
    const refreshToken = authService.getRefreshToken();

    if (!refreshToken) {
      authService.isRefreshing = false;
      authService.clearTokens();
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${AUTH_ENDPOINTS.REFRESH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const {
        access: accessToken,
        refresh: newRefreshToken,
        expires_in: expiresIn,
      } = data;

      // Update tokens with new values
      authService.setTokens(accessToken, newRefreshToken, expiresIn || 3600);

      // Process queued requests
      authService.failedQueue.forEach(({ resolve }) => resolve());
      authService.failedQueue = [];
      authService.isRefreshing = false;

      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      authService.failedQueue.forEach(({ reject }) => reject(error));
      authService.failedQueue = [];
      authService.isRefreshing = false;

      // Clear tokens and redirect to login on refresh failure
      authService.clearTokens();
      return false;
    }
  },

  // Initialize auth service (call on app startup)
  init: async () => {
    const accessToken = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return;
    }

    // If token is expired, refresh immediately
    if (authService.isTokenExpired()) {
      await authService.refreshAccessToken();
    } else {
      // Schedule refresh for later
      const expiresAt = parseInt(sessionStorage.getItem("tokenExpiresAt"));
      const timeUntilExpiry = Math.max(0, (expiresAt - Date.now()) / 1000);
      authService.scheduleTokenRefresh(Math.max(60, timeUntilExpiry - 300));
    }
  },
};

// Axios interceptor to handle 401 and refresh tokens
export const setupTokenInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If 401 and not already retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshed = await authService.refreshAccessToken();
          if (refreshed) {
            const newAccessToken = authService.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default authService;
