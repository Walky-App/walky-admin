import axios from "axios";
import { getEnv } from '../utils/env';

const API = axios.create({
  baseURL: getEnv().VITE_API_BASE_URL,
  //baseURL: import.meta.env.VITE_API_BASE_URL ??  "https://staging.walkyapp.com/api",
  // baseURL: "http://localhost:8080/api", // Use this for local development with /api prefix
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No token found for request:", config.url);
  }
  return config;
});

// Add response interceptor to log errors
API.interceptors.response.use(
  (response) => {
    console.log(
      "✅ API Response:",
      response.config.method?.toUpperCase(),
      response.config.url,
      response.status
    );
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.config?.method?.toUpperCase(),
      error.config?.url,
      error.response?.status,
      error.response?.statusText
    );
    if (error.response?.data) {
      console.error("📄 Error data:", error.response.data);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Token might be expired or invalid
      localStorage.removeItem("token");
      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
