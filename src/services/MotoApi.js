import axios from "./api";

export const getAllMotos = async () => {
    return await axios.get("/motos");
};

export const deleteMoto = async (id) => {
    return await axios.delete(`/motos/${id}`);
};

export const createMoto = async (motoData) => {
    return await axios.post("/motos", motoData);
};

export const updateMoto = async (id, motoData) => {
    return await axios.put(`/motos/${id}`, motoData);
};

export const getMotoByLicensePlate = async (licensePlate) => {
    return await axios.get(`/motos/${licensePlate}`);
};