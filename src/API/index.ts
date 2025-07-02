import axios from "axios";

const API = axios.create({
  baseURL: "https://staging.walkyapp.com",
  // baseURL: "http://192.168.15.11:8080", // Use this for local development
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
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
    return Promise.reject(error);
  }
);

export default API;
