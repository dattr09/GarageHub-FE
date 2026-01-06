import api from "./api";

export const createOrder = async (orderData) => {
    try {
        const response = await api.post("/orders", orderData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        throw error;
    }
};

export const getAllOrders = async () => {
    try {
        const response = await api.get("/orders");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error.response?.data || error.message);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error.response?.data || error.message);
        throw error;
    }
};

export const getOrdersByUser = async (userId) => {
    return await api.get(`/orders/user/${userId}`);
};

export const updateOrder = async (orderId, orderData) => {
    try {
        const response = await api.put(`/orders/${orderId}`, orderData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật đơn hàng:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteOrder = async (orderId) => {
    try {
        const response = await api.delete(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error.response?.data || error.message);
        throw error;
    }
};