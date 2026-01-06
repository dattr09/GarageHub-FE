import { useState, useEffect } from "react";
import { Calendar, Clock, Phone, User, Search, ChevronDown, Grid, List, Wrench } from "lucide-react";
import { AppointmentApi } from "../../services/AppointmentApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "Chờ xác nhận", label: "Chờ xác nhận" },
  { value: "Đã xác nhận", label: "Đã xác nhận" },
  { value: "Đang sửa", label: "Đang sửa" },
  { value: "Hoàn thành", label: "Hoàn thành" },
  { value: "Hủy", label: "Hủy" },
];

const STATUS_COLORS = {
  "Chờ xác nhận": "bg-amber-100 text-amber-700 border-amber-200",
  "Đã xác nhận": "bg-blue-100 text-blue-700 border-blue-200",
  "Đang sửa": "bg-orange-100 text-orange-700 border-orange-200",
  "Hoàn thành": "bg-green-100 text-green-700 border-green-200",
  "Hủy": "bg-red-100 text-red-700 border-red-200",
};

const STATUS_DOT = {
  "Chờ xác nhận": "bg-amber-500",
  "Đã xác nhận": "bg-blue-500",
  "Đang sửa": "bg-orange-500",
  "Hoàn thành": "bg-green-500",
  "Hủy": "bg-red-500",
};

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ date: "", status: "" });
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => { fetchAppointments(); }, [filters]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.date) params.date = filters.date;
      if (filters.status) params.status = filters.status;
      const res = await AppointmentApi.getAll(params);
      setAppointments(res.data.data || []);
    } catch (error) {
      Swal.fire("Lỗi", "Không thể tải danh sách lịch hẹn", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await AppointmentApi.updateStatus(id, newStatus);
      Swal.fire({ title: "Thành công!", icon: "success", timer: 1500, showConfirmButton: false });
      fetchAppointments();
    } catch (error) {
      Swal.fire("Lỗi", error.response?.data?.message || "Cập nhật thất bại", "error");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const filteredAppointments = appointments.filter((apt) => {
    const dateMatch = filters.date ? apt.date && apt.date.startsWith(filters.date) : true;
    const statusMatch = filters.status ? apt.status === filters.status : true;
    return dateMatch && statusMatch;
  });

  const stats = STATUS_OPTIONS.filter(o => o.value).map(opt => ({
    ...opt,
    count: appointments.filter(a => a.status === opt.value).length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold mb-1">Quản Lý Lịch Hẹn</h1>
            <p className="text-white/80 text-sm">{filteredAppointments.length} lịch hẹn</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stats.map((stat) => (
            <button
              key={stat.value}
              onClick={() => setFilters({ ...filters, status: filters.status === stat.value ? "" : stat.value })}
              className={`bg-white rounded-xl p-4 shadow-lg border-2 transition-all ${filters.status === stat.value ? "border-blue-500" : "border-transparent hover:border-gray-200"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${STATUS_DOT[stat.value]}`}></div>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3 items-center">
              <input
                type="date"
                value={filters.date}
                onChange={e => setFilters({ ...filters, date: e.target.value })}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <select
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-pulse text-gray-400">Đang tải...</div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy lịch hẹn</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt._id}
                className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all overflow-hidden"
              >
                <div className={`px-5 py-3 border-b ${STATUS_COLORS[apt.status] || "bg-gray-100"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{apt.status}</span>
                    <span className="text-sm opacity-80">{formatDate(apt.date)}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Khách hàng</p>
                        <p className="font-medium text-gray-800">{apt.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Điện thoại</p>
                        <p className="font-medium text-gray-800">{apt.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Giờ hẹn</p>
                        <p className="font-medium text-gray-800">{apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wrench className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Dịch vụ</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {apt.services.map((s, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <select
                      value={apt.status}
                      onChange={e => handleStatusChange(apt._id, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {STATUS_OPTIONS.filter(o => o.value).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((apt) => (
              <div
                key={apt._id}
                className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all p-4 flex flex-wrap gap-4 items-center"
              >
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[apt.status] || "bg-gray-100"}`}>
                  {apt.status}
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Khách hàng</p>
                    <p className="font-medium text-gray-800 truncate">{apt.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Điện thoại</p>
                    <p className="font-medium text-gray-800">{apt.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ngày</p>
                    <p className="font-medium text-gray-800">{formatDate(apt.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Giờ</p>
                    <p className="font-medium text-gray-800">{apt.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Loại xe</p>
                    <p className="font-medium text-gray-800">{apt.vehicleType}</p>
                  </div>
                </div>

                <select
                  value={apt.status}
                  onChange={e => handleStatusChange(apt._id, e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.filter(o => o.value).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
