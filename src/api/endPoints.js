export const BASE_URL = "http://127.0.0.1:8000";
export const AUTH_ENDPOINTS = {
  LOGIN: "/login/",
  REGISTER: "/register/",
  REFRESH: "/api/token/refresh/",
};

export const ORDERS_ENDPOINTS = {
  GET_ALL: "/orders/",
  GET_ONE: (id) => `/users/${id}`,
};

export const PRODUCT_ENDPOINTS = {
  GET_ALL: "/products/",
  GET_ONE: (id) => `/products/${id}`,
};
