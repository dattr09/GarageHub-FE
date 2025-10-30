import axios from "axios";
console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Điều hướng về trang đăng nhập
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
      const token = localStorage.getItem("token");
      const response = await api.get("/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};

export default api;
