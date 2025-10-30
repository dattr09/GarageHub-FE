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
export const getDeletedBrands = async (token) => {
  try {
    const response = await api.get("/brands/deleted/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching deleted brands:", error);
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

export const createBrand = async (formData, token) => {
  try {
    const response = await api.post("/brands", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating brand:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateBrand = async (id, formData, token) => {
  try {
    const response = await api.put(`/brands/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
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

export const restoreBrand = async (id, token) => {
  try {
    const response = await api.put(
      `/brands/restore/${id}`,
      {}, // 👈 body rỗng (thay vì null)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error restoring brand:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const deleteBrandPermanently = async (id) => {
  const res = await api.delete(`/brands/permanent/${id}`);
  return res.data;
};
