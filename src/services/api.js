import axios from "axios";
import Config from "../envVars";

const api = axios.create({
  baseURL: `${Config.BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes("/auth/me");
    if (error.response?.status === 401 && !isAuthCheck) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const AuthAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  verifyCode: (data) => api.post("/auth/verify", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
  resetPassword: (data, config) => api.post("/auth/reset-password", data, config),
  getAllUsers: async () => {
    try {
      const response = await api.get("/auth/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};

export default api;
