// src/api/MotoApi.js
import api from "./api"; // dùng lại instance chung

// ✅ Lấy tất cả xe
export const getAllMotos = async () => {
  const res = await api.get("/motos");
  return res.data;
};

// ✅ Lấy xe theo biển số
export const getMotoByLicensePlate = async (licensePlate) => {
  const res = await api.get(`/motos/${licensePlate}`);
  return res.data;
};

// ✅ Tạo xe mới
export const createMoto = async (data) => {
  const res = await api.post("/motos", data);
  return res.data;
};

// ✅ Cập nhật xe
export const updateMoto = async (licensePlate, data) => {
  const res = await api.put(`/motos/${licensePlate}`, data);
  return res.data;
};

// ✅ Xóa xe
export const deleteMoto = async (licensePlate) => {
  const res = await api.delete(`/motos/${licensePlate}`);
  return res.data;
};
