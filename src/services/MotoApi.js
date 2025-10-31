// src/api/MotoApi.js
import api from "./api"; // dùng lại instance chung

// ✅ Lấy tất cả xe
export const getAllMotos = async () => {
  const res = await api.get("/motos");
  return res.data;
};
export const getDeletedMotos = async (token) => {
  try {
    const response = await api.get("/motos/deleted/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Deleted motos response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching deleted motos:", error);
    throw error;
  }
};
// ✅ Lấy xe theo biển số
export const getMotoByLicensePlate = async (licensePlate) => {
  const res = await api.get(`/motos/license/${licensePlate}`);
  return res.data;
};

// ✅ Tạo xe mới
export const createMoto = async (data) => {
  const res = await api.post("/motos", data);
  return res.data;
};

// ✅ Cập nhật xe
export const updateMoto = async (licensePlate, data) => {
  const res = await api.put(`/motos/license/${licensePlate}`, data);
  return res.data;
};

// ✅ Xóa xe
export const deleteMoto = async (licensePlate) => {
  const res = await api.delete(`/motos/license/${licensePlate}`);
  return res.data;
};
export const restoreMoto = async (id, token) => {
  try {
    const response = await api.put(
      `/motos/restore/${id}`,
      {}, // 👈 body rỗng (thay vì null)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error restoring moto:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const deleteMotoPermanently = async (id) => {
  const res = await api.delete(`/motos/permanent/${id}`);
  return res.data;
};
