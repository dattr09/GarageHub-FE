import api from "./api";

export const getAllBrands = async () => {
    try {
        const response = await api.get("/brands");
        return response.data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        throw error;
    }
};

export const getBrandById = async (brandId) => {
  try {
    const response = await api.get(`/brands/${brandId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brand by ID:", error);
    throw error;
  }
};

export const createBrand = async (brandData, token) => {
    try {
        const response = await api.post("/brands", brandData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating brand:", error.response?.data || error.message);
        throw error;
    }
};

export const updateBrand = async (id, brandData, token) => {
    try {
        const response = await api.put(`/brands/${id}`, brandData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating brand:", error);
        throw error;
    }
};

export const deleteBrand = async (id, token) => {
    try {
        const response = await api.delete(`/brands/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting brand:", error);
        throw error;
    }
};