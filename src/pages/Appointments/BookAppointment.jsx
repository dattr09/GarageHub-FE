import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Mail, Bike, Wrench, FileText, Save, CheckCircle } from "lucide-react";
import { AppointmentApi } from "../../services/AppointmentApi";
import Swal from "sweetalert2";

const SERVICE_OPTIONS = [
  { value: "Thay nhớt", label: "Thay nhớt", icon: "🛢️" },
  { value: "Sửa phanh", label: "Sửa phanh", icon: "🔧" },
  { value: "Kiểm tra động cơ", label: "Kiểm tra động cơ", icon: "⚙️" },
  { value: "Bảo dưỡng định kỳ", label: "Bảo dưỡng định kỳ", icon: "🔩" },
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
      if (!form.customerName || !form.phone || !form.date || !form.time || !form.vehicleType || form.services.length === 0) {
        Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
        setLoading(false);
        return;
      }

      const res = await AppointmentApi.create(form);
      Swal.fire({
        title: "Đặt lịch thành công!",
        text: res.data.message || "Chúng tôi sẽ liên hệ xác nhận sớm nhất",
        icon: "success",
      }).then(() => {
        setForm({
          customerName: "", phone: "", email: "", date: "", time: "",
          vehicleType: "", services: [], note: "",
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

  const getMinDate = () => new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold mb-1">Đặt Lịch Sửa Xe</h1>
            <p className="text-white/80 text-sm">Điền thông tin để đặt lịch hẹn</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-4 pb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ tên"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="0xxx xxx xxx"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (không bắt buộc)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Thông tin đặt lịch
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sửa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    min={getMinDate()}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ sửa <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    disabled={!form.date || loadingSlots}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-50"
                  >
                    <option value="">-- Chọn giờ --</option>
                    {TIME_SLOTS.map((time) => {
                      const status = getSlotStatus(time);
                      return (
                        <option key={time} value={time} disabled={!status.available}>
                          {time} {!status.available ? "(Đã đầy)" : `(${status.count}/3)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại xe <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {VEHICLE_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setForm({ ...form, vehicleType: type.value })}
                        className={`px-5 py-2.5 rounded-xl border-2 font-medium transition-all flex items-center gap-2 ${form.vehicleType === type.value
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                      >
                        <Bike className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-500" />
                Dịch vụ cần sửa <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SERVICE_OPTIONS.map((service) => (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => handleServiceChange(service.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${form.services.includes(service.value)
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{service.icon}</span>
                      {form.services.includes(service.value) && (
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <p className={`font-medium text-sm ${form.services.includes(service.value) ? "text-orange-700" : "text-gray-700"}`}>
                      {service.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2 text-gray-400" />
                Ghi chú thêm (không bắt buộc)
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={3}
                placeholder="Mô tả thêm tình trạng xe..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? "Đang xử lý..." : "Đặt lịch ngay"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
