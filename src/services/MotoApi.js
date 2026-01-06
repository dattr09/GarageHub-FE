import api from "./api";

export const getAllMotos = async () => {
  const res = await api.get("/motos");
  return res.data;
};

export const getMotoByLicensePlate = async (licensePlate) => {
  const res = await api.get(`/motos/${licensePlate}`);
  return res.data;
};

export const createMoto = async (data) => {
  const res = await api.post("/motos", data);
  return res.data;
};

export const updateMoto = async (licensePlate, data) => {
  const res = await api.put(`/motos/${licensePlate}`, data);
  return res.data;
};

export const deleteMoto = async (licensePlate) => {
  const res = await api.delete(`/motos/${licensePlate}`);
  return res.data;
};
