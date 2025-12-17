import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { Api } from "./Api";
import { triggerDeactivatedModal } from "../contexts/DeactivatedUserContext";

/**
 * Get CSRF token from cookies
 * Looks for common CSRF cookie names used by security layers
 */
function getCsrfToken(): string | null {
  const cookieNames = ["csrf_cookie_rr", "XSRF-TOKEN", "csrf_token", "_csrf"];
  for (const name of cookieNames) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) {
      return decodeURIComponent(match[2]);
    }
  }
  return null;
}

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "https://staging.walkyapp.com/api",
  // baseURL: "http://localhost:8080/api", // Use this for local development with /api prefix
  withCredentials: true, // Enable cookies for CSRF
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No token found for request:", config.url);
  }

  // Add CSRF token for non-GET requests
  if (config.method && !["get", "head", "options"].includes(config.method.toLowerCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      // Try multiple common CSRF header names
      config.headers["X-CSRF-Token"] = csrfToken;
      config.headers["X-XSRF-Token"] = csrfToken;
    }
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
      response.status,
    );
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.config?.method?.toUpperCase(),
      error.config?.url,
      error.response?.status,
      error.response?.statusText,
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

    // Handle 403 Forbidden errors - only show deactivated modal for actual deactivation
    if (error.response?.status === 403) {
      const errorCode = (error.response?.data as any)?.code;
      // Only trigger deactivated modal for actual account deactivation, not permission errors
      if (errorCode === 'ACCOUNT_DEACTIVATED' || errorCode === 'USER_DEACTIVATED') {
        triggerDeactivatedModal();
      }
    }

    return Promise.reject(error);
  },
);

// Initialize OpenAPI Client
// Note: Swagger paths are mixed - admin routes include /api prefix, others don't
// Remove /api from baseURL so:
// - Admin routes (/api/admin/...) work as-is
// - Legacy routes (/ambassadors, etc.) hit the legacy router at root
const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? "https://staging.walkyapp.com/api";

// Create Api directly with config (Api extends HttpClient, so it creates its own axios instance)
export const apiClient = new Api({
  baseURL: baseURL.replace(/\/api\/?$/, ""),
}) as Api<unknown> & { http: { instance: typeof Api.prototype.instance } };

// Add http property for backward compatibility (some code uses apiClient.http.instance)
(apiClient as any).http = { instance: apiClient.instance };

// Expose httpClient for backward compatibility
export const httpClient = { instance: apiClient.instance };

// Enable cookies for CSRF
apiClient.instance.defaults.withCredentials = true;

// Apply interceptors to the Api's axios instance
apiClient.instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found for request:", config.url);
    }

    // Add CSRF token for non-GET requests
    if (config.method && !["get", "head", "options"].includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        // Try multiple common CSRF header names
        config.headers["X-CSRF-Token"] = csrfToken;
        config.headers["X-XSRF-Token"] = csrfToken;
      }
    }

    return config;
  },
);

apiClient.instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      "✅ API Response:",
      response.config.method?.toUpperCase(),
      response.config.url,
      response.status,
    );
    return response;
  },
  (error: AxiosError) => {
    console.error(
      "❌ API Error:",
      error.config?.method?.toUpperCase(),
      error.config?.url,
      error.response?.status,
      error.response?.statusText,
    );
    if (error.response?.data) {
      console.error("📄 Error data:", error.response.data);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden errors - only show deactivated modal for actual deactivation
    if (error.response?.status === 403) {
      const errorCode = (error.response?.data as any)?.code;
      // Only trigger deactivated modal for actual account deactivation, not permission errors
      if (errorCode === 'ACCOUNT_DEACTIVATED' || errorCode === 'USER_DEACTIVATED') {
        triggerDeactivatedModal();
      }
    }

    return Promise.reject(error);
  },
);

export default API;
