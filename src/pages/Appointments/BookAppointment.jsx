import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Mail, Car, Wrench, FileText, Save } from "lucide-react";
import { AppointmentApi } from "../../services/AppointmentApi";
import Swal from "sweetalert2";

const SERVICE_OPTIONS = [
  { value: "Thay nhớt", label: "Thay nhớt" },
  { value: "Sửa phanh", label: "Sửa phanh" },
  { value: "Kiểm tra động cơ", label: "Kiểm tra động cơ" },
  { value: "Bảo dưỡng định kỳ", label: "Bảo dưỡng định kỳ" },
];

const VEHICLE_TYPES = [
  { value: "xe số", label: "Xe số" },
  { value: "tay ga", label: "Tay ga" },
  { value: "xe côn", label: "Xe côn" },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

export default function BookAppointment() {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    vehicleType: "",
    services: [],
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Lấy khung giờ khả dụng khi chọn ngày
  useEffect(() => {
    if (form.date) {
      fetchAvailableSlots(form.date);
    }
  }, [form.date]);

  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true);
    try {
      const res = await AppointmentApi.getAvailableSlots(date);
      setAvailableSlots(res.data.data || []);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleServiceChange = (service) => {
    setForm((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!form.customerName || !form.phone || !form.date || !form.time || !form.vehicleType || form.services.length === 0) {
        Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc", "error");
        setLoading(false);
        return;
      }

      const res = await AppointmentApi.create(form);
      Swal.fire("Thành công", res.data.message || "Đặt lịch thành công!", "success").then(() => {
        // Reset form
        setForm({
          customerName: "",
          phone: "",
          email: "",
          date: "",
          time: "",
          vehicleType: "",
          services: [],
          note: "",
        });
        setAvailableSlots([]);
      });
    } catch (error) {
      Swal.fire("Lỗi", error.response?.data?.message || "Đặt lịch thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (time) => {
    const slot = availableSlots.find((s) => s.time === time);
    if (!slot) return { available: true, count: 0 };
    return { available: slot.available, count: slot.count };
  };

  // Lấy ngày tối thiểu (hôm nay)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 rounded-lg shadow-md bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 text-blue-600">
          <Calendar className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-blue-800">Đặt lịch sửa xe</h2>
        </div>
        <p className="text-gray-600">Vui lòng điền đầy đủ thông tin bên dưới</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin khách hàng */}
        <div className="bg-blue-50 rounded-lg p-6 shadow">
          <h3 className="font-semibold text-blue-700 mb-4">Thông tin khách hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <User className="w-5 h-5 text-blue-500" />
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
                placeholder="Nhập họ tên"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <Phone className="w-5 h-5 text-blue-500" />
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <Mail className="w-5 h-5 text-blue-500" />
                Email (không bắt buộc)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
                placeholder="Nhập email (nếu có)"
              />
            </div>
          </div>
        </div>

        {/* Thông tin đặt lịch */}
        <div className="bg-green-50 rounded-lg p-6 shadow">
          <h3 className="font-semibold text-green-700 mb-4">Thông tin đặt lịch</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <Calendar className="w-5 h-5 text-green-500" />
                Ngày sửa <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                min={getMinDate()}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <Clock className="w-5 h-5 text-green-500" />
                Giờ sửa <span className="text-red-500">*</span>
              </label>
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                disabled={!form.date || loadingSlots}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
              >
                <option value="">-- Chọn giờ --</option>
                {TIME_SLOTS.map((time) => {
                  const status = getSlotStatus(time);
                  return (
                    <option
                      key={time}
                      value={time}
                      disabled={!status.available}
                    >
                      {time} {!status.available ? "(Đã đầy)" : `(${status.count}/3)`}
                    </option>
                  );
                })}
              </select>
              {loadingSlots && <p className="text-sm text-gray-500 mt-1">Đang tải khung giờ...</p>}
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <Car className="w-5 h-5 text-green-500" />
                Loại xe <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
              >
                <option value="">-- Chọn loại xe --</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dịch vụ cần sửa */}
        <div className="bg-orange-50 rounded-lg p-6 shadow">
          <h3 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Dịch vụ cần sửa <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SERVICE_OPTIONS.map((service) => (
              <label key={service.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.services.includes(service.value)}
                  onChange={() => handleServiceChange(service.value)}
                  className="w-5 h-5 accent-orange-600"
                />
                <span className="text-gray-700">{service.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ghi chú */}
        <div className="bg-gray-50 rounded-lg p-6 shadow">
          <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
            <FileText className="w-5 h-5 text-gray-500" />
            Ghi chú thêm (không bắt buộc)
          </label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gray-200"
            placeholder="Ghi chú thêm (nếu có)..."
          />
        </div>

        {/* Nút submit */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold shadow-lg disabled:opacity-50 transition"
          >
            <Save className="w-5 h-5" />
            {loading ? "Đang xử lý..." : "Đặt lịch"}
          </button>
        </div>
      </form>
    </div>
  );
}

