import axios from "axios";
import { env } from "@/lib/env";

export const BASE_URL = env.VITE_API_URL;
// const BASE_URL = import.meta.env.VITE_API_URL;

// export const USERS_URL = `${BASE_URL}/users/users/`;
// export const CURRENT_USER_URL = `${BASE_URL}/users/current-user/`;

const api = axios.create({
  baseURL: env.VITE_API_URL,
  // baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  } else {
    config.headers.Authorization = ``;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("Token");
      // window.location.href = "/login";
    }
  }
);

export default api;
