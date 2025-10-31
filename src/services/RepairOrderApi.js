import api from "./api";

export const RepairOrderApi = {
  getAll: async () => (await api.get("/repair-orders")).data,
  getById: async (id) => (await api.get(`/repair-orders/${id}`)).data,
  create: async (data) => (await api.post("/repair-orders", data)).data,
  update: async (id, data) =>
    (await api.put(`/repair-orders/${id}`, data)).data,
  remove: async (id) => (await api.delete(`/repair-orders/${id}`)).data,
};

export const deleteRepairOrderPermanently = async (id) => {
  try {
    const res = await api.delete(`/repair-orders/permanent/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting repair order permanently:", error);
    throw error;
  }
};

export const getDeletedRepairOrders = async () => {
  try {
    const res = await api.get("/repair-orders/deleted/list");
    return res.data;
  } catch (error) {
    console.error("Error fetching deleted repair orders:", error);
    throw error;
  }
};

export const restoreRepairOrder = async (id) => {
  try {
    const res = await api.put(`/repair-orders/restore/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error restoring repair order:", error);
    throw error;
  }
};
