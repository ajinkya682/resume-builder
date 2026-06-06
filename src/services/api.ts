import axios from "axios";

/**
 * Architecture: We use a single axios instance with:
 * - baseURL pointing to same-origin (relative)
 * - withCredentials: true so the HTTP-Only JWT cookie is sent automatically
 * - Response interceptor to normalize errors
 *
 * Why not fetch()? Axios gives us interceptors, automatic JSON parsing,
 * and cleaner error handling which is crucial for a production SaaS app.
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — normalize error shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default api;
