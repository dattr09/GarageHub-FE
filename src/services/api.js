import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ✅ Tự động xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const AuthAPI = {
  login: (data) => api.post("/users/login", data),
  register: (data) => api.post("/users/register", data),
  verifyCode: (data) => api.post("/users/verify", data),
  forgotPassword: (data) => api.post("/users/forgot-password", data),
  verifyOtp: (data) => api.post("/users/verify-otp", data),
  resetPassword: (data, config) =>
    api.post("/users/reset-password", data, config),
  getUserInfo: () => api.get("/users/me"),
  // ✅ Lấy tất cả user (token nằm trong cookies nên không cần header)
  getAllUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw error;
    }
  },
};

export default api;
