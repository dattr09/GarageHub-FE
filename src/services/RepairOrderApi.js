import api from "./api";

export const RepairOrderApi = {
  getAll: () => api.get("/repair-orders"),
  getById: (id) => api.get(`/repair-orders/${id}`),
  create: (data) => api.post("/repair-orders", data),
  update: (id, data) => api.put(`/repair-orders/${id}`, data),
  remove: (id) => api.delete(`/repair-orders/${id}`),
};