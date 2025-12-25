import api from "./api"; // Sử dụng module `api` để gọi API

// Lấy danh sách phụ tùng
export const getAllParts = async () => {
    try {
        const response = await api.get("/parts");
        return response.data;
    } catch (error) {
        console.error("Error fetching parts:", error);
        throw error;
    }
};

// Lấy phụ tùng theo ID
export const getPartById = async (id) => {
    try {
        const response = await api.get(`/parts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching part:", error);
        throw error;
    }
};

// Thêm phụ tùng mới
export const createPart = async (formData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post("/parts", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating part:", error.response?.data || error.message);
        throw error;
    }
};

// Cập nhật phụ tùng
export const updatePart = async (id, formData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put(`/parts/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating part:", error);
        throw error;
    }
};

// Xóa phụ tùng
export const deletePart = async (id, token) => {
    try {
        const response = await api.delete(`/parts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting part:", error);
        throw error;
    }
};

// Lấy phụ tùng theo thương hiệu
export const getPartsByBrand = async (brandId) => {
    try {
        const response = await api.get(`/parts/${brandId}/parts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching parts by brand:", error);
        throw error;
    }
};

// Hàm cập nhật tồn kho sản phẩm
export const updatePartQuantity = async (partId, quantity) => {
    try {
        const response = await api.patch(`/parts/${partId}/quantity`, { quantity });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật tồn kho sản phẩm:", error.response?.data || error.message);
        throw error;
    }
};