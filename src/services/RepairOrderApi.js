import api from "./api";

export const RepairOrderApi = {
  getAll: async () => {
    const res = await api.get("/repair-orders");
    return res.data;
  },
  getById: (id) => api.get(`/repair-orders/${id}`),
  create: (data) => api.post("/repair-orders", data),
  update: (id, data) => api.put(`/repair-orders/${id}`, data),
  remove: (id) => api.delete(`/repair-orders/${id}`),
};
export const deleteRepairOrderPermanently = async (id) => {
  const res = await api.delete(`/repair-orders/permanent/${id}`);
  return res.data;
};
export const getDeletedRepairOrders = async (token) => {
  try {
    const response = await api.get("/repair-orders/deleted/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Deleted repair orders response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching deleted repair orders:", error);
    throw error;
  }
};
