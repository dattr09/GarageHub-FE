import api from "./api";

// Lấy xe theo biển số
export const getMotoByLicensePlate = async (licensePlate) => {
    try {
        const response = await api.get(`/motos/${licensePlate}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching moto by license plate:", error);
        throw error;
    }
};

// Cập nhật xe theo biển số
export const updateMoto = async (licensePlate, motoData) => {
    try {
        const response = await api.put(`/motos/${licensePlate}`, motoData);
        return response.data;
    } catch (error) {
        console.error("Error updating moto:", error);
        throw error;
    }
};

// Các API khác giữ nguyên như bạn đã viết
export const getAllMotos = async () => {
    try {
        const response = await api.get("/motos");
        return response.data;
    } catch (error) {
        console.error("Error fetching motos:", error);
        throw error;
    }
};

export const createMoto = async (motoData) => {
    try {
        const response = await api.post("/motos", motoData);
        return response.data;
    } catch (error) {
        console.error("Error creating moto:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteMoto = async (licensePlate) => {
    try {
        const response = await api.delete(`/motos/${licensePlate}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting moto:", error);
        throw error;
    }
};
