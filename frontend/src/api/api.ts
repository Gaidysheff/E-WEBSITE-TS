import axios from "axios";
import { env } from "@/lib/env";

export const BASE_URL = env.VITE_API_URL;

// 1. Для публичных запросов (БЕЗ перехватчиков и токенов)
export const publicApi = axios.create({
  baseURL: BASE_URL,
});

// 2. Для приватных запросов (С авторизацией)
const privateApi = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 5000,
  withCredentials: true, // Передает куки сессии (sessionid) на бэкенд автоматически
  xsrfCookieName: "csrftoken", // Автоматически берет CSRF из куки
  xsrfHeaderName: "X-CSRFToken", // И вставляет в заголовок
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  } else {
    config.headers.Authorization = ``;
  }

  // Вытаскиваем текущий сохраненный язык из localStorage ('ru' или 'en')
  const currentLang = localStorage.getItem("app_lang") || "ru";

  // Передаем его в стандартный заголовок
  config.headers["Accept-Language"] = currentLang;

  return config;
});

privateApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("Token");
      // window.location.href = "/login";
      // Здесь можно добавить navigate('/login') если нужно
    }

    // ВАЖНО: пробрасываем ошибку дальше, чтобы её поймал catch в компоненте
    return Promise.reject(error);
  },
);

export default privateApi;
