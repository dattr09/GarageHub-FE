import { useState, useEffect } from "react";
import { Calendar, Clock, Phone, User, Search, Filter, Eye } from "lucide-react";
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
  "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
  "Đã xác nhận": "bg-blue-100 text-blue-800",
  "Đang sửa": "bg-orange-100 text-orange-800",
  "Hoàn thành": "bg-green-100 text-green-800",
  "Hủy": "bg-red-100 text-red-800",
};

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ date: "", status: "" });
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
      Swal.fire("Thành công", "Cập nhật trạng thái thành công", "success");
      fetchAppointments();
    } catch (error) {
      Swal.fire("Lỗi", error.response?.data?.message || "Cập nhật thất bại", "error");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });
  };

  // Lọc danh sách theo tên hoặc sđt hoặc ngày
  const filteredAppointments = appointments.filter((apt) => {
    const dateMatch = filters.date ? apt.date && apt.date.startsWith(filters.date) : true;
    const statusMatch = filters.status ? apt.status === filters.status : true;
    return dateMatch && statusMatch;
  });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md max-w-6xl mx-auto mt-6">
      {/* Tiêu đề */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 text-blue-600">
          <Calendar className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-blue-800">Danh sách lịch hẹn sửa xe</h2>
        </div>
      </div>

      {/* Thanh tìm kiếm/filter */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-end">
          {/* Có thể thêm nút tạo mới nếu cần */}
        </div>
        <div className="flex w-full justify-end">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="date"
              value={filters.date}
              onChange={e => setFilters({ ...filters, date: e.target.value })}
              className="border rounded px-3 py-2 w-full md:w-64"
            />
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="border rounded px-3 py-2 w-full md:w-64"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
        </div>
      ) : (
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Giờ</th>
              <th className="px-4 py-3">Loại xe</th>
              <th className="px-4 py-3">Dịch vụ</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-100 transition border-b last:border-none">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {apt.customerName}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {apt.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatDate(apt.date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {apt.time}
                    </div>
                  </td>
                  <td className="px-4 py-3">{apt.vehicleType}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {apt.services.map((service, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{service}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${STATUS_COLORS[apt.status] || "bg-gray-100 text-gray-800"}`}>{apt.status}</span>
                  </td>
                  <td className="px-4 py-3 flex flex-col gap-2 items-center">
                    <select
                      value={apt.status}
                      onChange={e => handleStatusChange(apt._id, e.target.value)}
                      className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-200"
                    >
                      {STATUS_OPTIONS.filter(opt => opt.value !== "").map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {apt.note && (
                      <button
                        onClick={() => Swal.fire({ title: "Ghi chú", text: apt.note, icon: "info" })}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >Xem ghi chú</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">Không có lịch hẹn nào được tìm thấy.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Thống kê trạng thái */}
      {appointments.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {STATUS_OPTIONS.filter(opt => opt.value !== "").map(opt => {
            const count = appointments.filter(apt => apt.status === opt.value).length;
            return (
              <div key={opt.value} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className={`text-2xl font-bold ${STATUS_COLORS[opt.value]?.split(" ")[1] || "text-gray-800"}`}>{count}</div>
                <div className="text-sm text-gray-600">{opt.label}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

