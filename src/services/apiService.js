import axios from "axios";
import { AUTH_ENDPOINTS, BASE_URL } from "../api/endPoints";
import authService from "../services/authService";

/**
 * Create axios instance with base config
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Variables to prevent multiple simultaneous refresh token requests
 */
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Centralized error handler
 */
const handleError = (error) => {
  let errorMessage = "An error occurred";
  let errorCode = null;
  let errorDetails = null;

  if (!error.response) {
    // Network Error - No response from server
    if (error.code === "ECONNABORTED") {
      errorMessage = "Request timeout - server took too long to respond";
      errorCode = "TIMEOUT";
    } else if (error.message === "Network Error") {
      errorMessage = "Network error - please check your internet connection";
      errorCode = "NETWORK_ERROR";
    } else if (error.code === "ERR_NETWORK") {
      errorMessage = "Network error - unable to reach the server";
      errorCode = "NETWORK_ERROR";
    } else {
      errorMessage = error.message || "Unknown network error";
      errorCode = "UNKNOWN_ERROR";
    }
  } else {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    errorDetails = data;

    switch (status) {
      case 400:
        errorMessage = data?.message || "Bad request - invalid data sent";
        errorCode = "BAD_REQUEST";
        break;

      case 401:
        errorMessage = "Unauthorized - please login again";
        errorCode = "UNAUTHORIZED";
        break;

      case 403:
        errorMessage = "Forbidden - you don't have permission";
        errorCode = "FORBIDDEN";
        break;

      case 404:
        errorMessage = "Resource not found";
        errorCode = "NOT_FOUND";
        break;

      case 409:
        errorMessage = data?.message || "Conflict - resource already exists";
        errorCode = "CONFLICT";
        break;

      case 422:
        errorMessage = "Validation error - check your input";
        errorCode = "VALIDATION_ERROR";
        break;

      case 429:
        errorMessage = "Too many requests - please wait a moment";
        errorCode = "RATE_LIMIT";
        break;

      case 500:
        errorMessage = "Server error - please try again later";
        errorCode = "SERVER_ERROR";
        break;

      case 502:
        errorMessage = "Bad gateway - server is temporarily unavailable";
        errorCode = "BAD_GATEWAY";
        break;

      case 503:
        errorMessage = "Service unavailable - server is down";
        errorCode = "SERVICE_UNAVAILABLE";
        break;

      default:
        errorMessage = data?.message || `Error ${status}`;
        errorCode = `HTTP_${status}`;
    }
  }

  // Log error for debugging
  console.error(`[API Error] ${errorCode}: ${errorMessage}`, errorDetails);

  const customError = new Error(errorMessage);
  customError.code = errorCode;
  customError.details = errorDetails;
  customError.originalError = error;

  return customError;
};

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches access token to every request
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure headers are always set
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };

    return config;
  },
  (error) => {
    return Promise.reject(handleError(error));
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handles automatic token refresh when receiving 401 Unauthorized
 * Also handles all error responses
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Prevent multiple simultaneous refresh requests
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = authService.getRefreshToken();

          if (!refreshToken) {
            // No refresh token - force logout
            authService.clearTokens();
            window.location.href = "/auth/login";
            return Promise.reject(handleError(error));
          }

          // Request new access token (bypass interceptors)
          const response = await axios.post(
            `${BASE_URL}${AUTH_ENDPOINTS.refresh}`,
            { refreshToken },
            { timeout: 15000 }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Save new tokens
          authService.setTokens(accessToken, newRefreshToken);

          // Update original request with new token
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          // Notify all queued requests with new token
          onRefreshed(accessToken);

          // Retry original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - force logout
          authService.clearTokens();
          window.location.href = "/auth/login";
          isRefreshing = false;
          return Promise.reject(handleError(refreshError));
        } finally {
          isRefreshing = false;
        }
      } else {
        // Refresh already in progress - queue this request
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }
    }

    // For all other errors, use error handler
    return Promise.reject(handleError(error));
  }
);

/**
 * HTTP Methods - Ready to use functions
 */

// GET Request
export const apiGet = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error;
  }
};

// POST Request
export const apiPost = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error;
  }
};

// PUT Request
export const apiPut = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(url, data, config);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error;
  }
};

// PATCH Request
export const apiPatch = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.patch(url, data, config);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error;
  }
};

// DELETE Request
export const apiDelete = async (url, config = {}) => {
  try {
    const response = await apiClient.delete(url, config);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error;
  }
};

export default apiClient;