import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://eventbooker-024e32ba58a3.herokuapp.com/api";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling (e.g., 401 for logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., logout user, redirect to login
      // This depends on your app's specific needs.
      // For now, we just log it. You might dispatch a logout action here.
      console.error("Unauthorized access - 401. Logging out or redirecting...");
      // localStorage.removeItem('token');
      // window.location.href = '/login'; // Force redirect
    }
    return Promise.reject(error);
  }
);

export default api;
