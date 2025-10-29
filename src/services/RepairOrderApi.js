import api from "./api";

export const getAllRepairOrders = async () => {
    try {
        const response = await api.get("/repair-orders");
        return response.data;
    } catch (error) {
        console.error("Error fetching repair orders:", error);
        throw error;
    }
};

export const getRepairOrderById = async (id) => {
    try {
        const response = await api.get(`/repair-orders/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching repair order by ID:", error);
        throw error;
    }
};

export const createRepairOrder = async (orderData) => {
    try {
        const response = await api.post("/repair-orders", orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating repair order:", error.response?.data || error.message);
        throw error;
    }
};

export const updateRepairOrder = async (id, orderData) => {
    try {
        const response = await api.put(`/repair-orders/${id}`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error updating repair order:", error);
        throw error;
    }
};

export const deleteRepairOrder = async (id) => {
    try {
        const response = await api.delete(`/repair-orders/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting repair order:", error);
        throw error;
    }
};
