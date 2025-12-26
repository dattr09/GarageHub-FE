import api from "./api";

export const AppointmentApi = {
  // Public APIs (không cần đăng nhập)
  create: (data) => api.post("/appointments", data),
  getAvailableSlots: (date) => api.get("/appointments/slots/available", { params: { date } }),
  getByPhone: (phone) => api.get(`/appointments/phone/${phone}`),
  cancel: (id, phone) => api.post(`/appointments/${id}/cancel`, { phone }),

  // Protected APIs (cần đăng nhập - admin/employee)
  getAll: (params) => api.get("/appointments", { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
};

