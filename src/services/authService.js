import { BASE_URL } from "../api/endPoints";
import { AUTH_ENDPOINTS } from "../api/endPoints";

const authService = {
  refreshTimer: null,
  isRefreshing: false,
  failedQueue: [],

  /**
   * Set tokens in storage with proper expiration calculation
   */
  setTokens: (accessToken, refreshToken, expiresIn = 3600) => {
    // Validate tokens
    if (!accessToken || !refreshToken) {
      console.error("❌ Access token and refresh token are required");
      return false;
    }

    try {
      const expiresAt = Date.now() + expiresIn * 1000;

      sessionStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      sessionStorage.setItem("tokenExpiresAt", expiresAt.toString());

      console.log("✅ Tokens saved successfully");

      // Schedule token refresh 5 minutes before expiration
      authService.scheduleTokenRefresh(expiresIn - 300);
      return true;
    } catch (error) {
      console.error("❌ Error saving tokens:", error);
      return false;
    }
  },

  /**
   * Get access token from storage
   */
  getAccessToken: () => {
    try {
      return sessionStorage.getItem("accessToken");
    } catch (error) {
      console.error("❌ Error getting access token:", error);
      return null;
    }
  },

  /**
   * Get refresh token from storage
   */
  getRefreshToken: () => {
    try {
      return localStorage.getItem("refreshToken");
    } catch (error) {
      console.error("❌ Error getting refresh token:", error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const accessToken = authService.getAccessToken();
    return !!accessToken && !authService.isTokenExpired();
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: () => {
    try {
      const expiresAt = sessionStorage.getItem("tokenExpiresAt");
      if (!expiresAt) {
        console.warn("⚠️ No token expiry found");
        return true;
      }
      const isExpired = Date.now() > parseInt(expiresAt);
      if (isExpired) {
        console.warn("⚠️ Access token expired");
      }
      return isExpired;
    } catch (error) {
      console.error("❌ Error checking token expiry:", error);
      return true;
    }
  },

  /**
   * Clear all tokens (logout)
   */
  clearTokens: () => {
    try {
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("tokenExpiresAt");

      if (authService.refreshTimer) {
        clearTimeout(authService.refreshTimer);
        authService.refreshTimer = null;
      }

      authService.isRefreshing = false;
      authService.failedQueue = [];

      console.log("✅ Tokens cleared - redirecting to login");

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    } catch (error) {
      console.error(" Error clearing tokens:", error);
    }
  },

  /**
   * Schedule automatic token refresh before expiration
   */
  scheduleTokenRefresh: (expiresIn) => {
    try {
      // Clear existing timer to prevent multiple timers
      if (authService.refreshTimer) {
        clearTimeout(authService.refreshTimer);
      }

      // Convert seconds to milliseconds and schedule refresh
      if (expiresIn > 0) {
        authService.refreshTimer = setTimeout(() => {
          console.log("⏰ Auto-refreshing token...");
          authService.refreshAccessToken();
        }, expiresIn * 1000);

        console.log(`✅ Token refresh scheduled in ${expiresIn} seconds`);
      } else {
        console.warn("⚠️ Invalid expiration time");
      }
    } catch (error) {
      console.error("❌ Error scheduling token refresh:", error);
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken: async () => {
    // Prevent multiple simultaneous refresh requests
    if (authService.isRefreshing) {
      console.log("⏳ Token refresh already in progress...");
      return new Promise((resolve, reject) => {
        authService.failedQueue.push({ resolve, reject });
      });
    }

    authService.isRefreshing = true;
    const refreshToken = authService.getRefreshToken();

    if (!refreshToken) {
      console.error("❌ No refresh token found");
      authService.isRefreshing = false;
      authService.clearTokens();
      return false;
    }

    try {
      const response = await fetch(`${BASE_URL}${AUTH_ENDPOINTS.REFRESH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        timeout: 15000, // 15 second timeout
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed with status ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      const accessToken = data.access || data.accessToken;
      const newRefreshToken = data.refresh || data.refreshToken;
      const expiresIn = data.expires_in || data.expiresIn || 3600;

      if (!accessToken) {
        throw new Error("No access token in refresh response");
      }

      // Update tokens with new values
      authService.setTokens(accessToken, newRefreshToken || refreshToken, expiresIn);

      // Process queued requests
      authService.failedQueue.forEach(({ resolve }) => resolve(true));
      authService.failedQueue = [];
      authService.isRefreshing = false;

      console.log("✅ Access token refreshed successfully");
      return true;
    } catch (error) {
      console.error("❌ Token refresh error:", error.message);

      // Reject all queued requests
      authService.failedQueue.forEach(({ reject }) => reject(error));
      authService.failedQueue = [];
      authService.isRefreshing = false;

      // Clear tokens and redirect to login on refresh failure
      authService.clearTokens();
      return false;
    }
  },

  /**
   * Initialize auth service (call on app startup)
   */
  init: async () => {
    try {
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();

      if (!accessToken || !refreshToken) {
        console.log("⚠️ No tokens found - user not authenticated");
        return false;
      }

      console.log("🔄 Initializing auth service...");

      // If token is expired, refresh immediately
      if (authService.isTokenExpired()) {
        console.log("🔄 Token expired - refreshing immediately...");
        const refreshed = await authService.refreshAccessToken();
        return refreshed;
      } else {
        // Schedule refresh for later
        const expiresAt = parseInt(sessionStorage.getItem("tokenExpiresAt"));
        const timeUntilExpiry = Math.max(0, (expiresAt - Date.now()) / 1000);
        const scheduleTime = Math.max(60, timeUntilExpiry - 300);

        authService.scheduleTokenRefresh(scheduleTime);
        console.log("✅ Auth service initialized");
        return true;
      }
    } catch (error) {
      console.error("❌ Auth initialization error:", error);
      return false;
    }
  },

  /**
   * Get user authentication status
   */
  getAuthStatus: () => {
    return {
      isAuthenticated: authService.isAuthenticated(),
      hasAccessToken: !!authService.getAccessToken(),
      hasRefreshToken: !!authService.getRefreshToken(),
      isTokenExpired: authService.isTokenExpired(),
    };
  },
};

/**
 * Axios interceptor to handle 401 and refresh tokens
 */
export const setupTokenInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {};

      // If 401 and not already retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshed = await authService.refreshAccessToken();

          if (refreshed) {
            const newAccessToken = authService.getAccessToken();

            if (newAccessToken) {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newAccessToken}`,
              };
              console.log("🔄 Retrying request with new token...");
              return axiosInstance(originalRequest);
            } else {
              throw new Error("No access token after refresh");
            }
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          console.error("❌ Failed to refresh token:", refreshError);
          authService.clearTokens();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default authService;