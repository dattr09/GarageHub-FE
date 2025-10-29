import axios from "./api";

// 🟢 Tạo đơn hàng mới
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post("/orders", orderData); // Gửi dữ liệu đơn hàng lên API
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// 🟢 Lấy tất cả đơn hàng
export const getAllOrders = async () => {
    try {
        const response = await api.get("/orders");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error.response?.data || error.message);
        throw error;
    }
};

// 🟢 Lấy đơn hàng theo ID
export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error.response?.data || error.message);
        throw error;
    }
};

// 🟢 Lấy đơn hàng theo userId
export const getOrdersByUser = async (userId) => {
    return await axios.get(`/orders/user/${userId}`);
};

// 🟢 Cập nhật đơn hàng
export const updateOrder = async (orderId, orderData) => {
    try {
        const response = await api.put(`/orders/${orderId}`, orderData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật đơn hàng:", error.response?.data || error.message);
        throw error;
    }
};

// 🟢 Xóa đơn hàng
export const deleteOrder = async (orderId) => {
    try {
        const response = await api.delete(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error.response?.data || error.message);
        throw error;
    }
};