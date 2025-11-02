import api from "./api";

export const getStatistics = async (params) => {
    const res = await api.get("/statistics", { params });
    return res.data;
};