import api from "./api";

export const getAllParts = async () => {
    try {
        const response = await api.get("/parts");
        return response.data;
    } catch (error) {
        console.error("Error fetching parts:", error);
        throw error;
    }
};

export const getPartById = async (id) => {
    try {
        const response = await api.get(`/parts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching part:", error);
        throw error;
    }
};

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

export const getPartsByBrand = async (brandId) => {
    try {
        const response = await api.get(`/parts/${brandId}/parts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching parts by brand:", error);
        throw error;
    }
};

export const updatePartQuantity = async (partId, quantity) => {
    try {
        const response = await api.patch(`/parts/${partId}/quantity`, { quantity });
        return response.data;
    } catch (error) {
        console.error("Error updating part quantity:", error.response?.data || error.message);
        throw error;
    }
};

export const getPartReviews = async (partId) => {
    try {
        const response = await api.get(`/parts/${partId}/reviews`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export const createPartReview = async (partId, reviewData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(`/parts/${partId}/reviews`, reviewData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error.response?.data || error.message);
        throw error;
    }
};