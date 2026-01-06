import { useState } from "react";
import { Search as SearchIcon, Phone, Calendar, Clock, X, AlertCircle, Wrench, User, Bike } from "lucide-react";
import { AppointmentApi } from "../../services/AppointmentApi";
import Swal from "sweetalert2";

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

export default function SearchAppointment() {
  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập số điện thoại", "error");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await AppointmentApi.getByPhone(phone);
      setAppointments(res.data.data || []);
      if (res.data.data.length === 0) {
        Swal.fire("Thông báo", "Không tìm thấy lịch hẹn nào", "info");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Không thể tìm kiếm lịch hẹn", "error");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointment) => {
    if (appointment.status === "Hoàn thành" || appointment.status === "Hủy") {
      Swal.fire("Thông báo", "Không thể hủy lịch hẹn này", "info");
      return;
    }

    const result = await Swal.fire({
      title: "Hủy lịch hẹn?",
      text: `Bạn có chắc muốn hủy lịch hẹn ngày ${formatDate(appointment.date)}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Hủy lịch",
      cancelButtonText: "Không",
    });

    if (result.isConfirmed) {
      try {
        await AppointmentApi.cancel(appointment._id, phone);
        Swal.fire({ title: "Đã hủy!", icon: "success", timer: 1500, showConfirmButton: false });
        handleSearch();
      } catch (error) {
        Swal.fire("Lỗi", error.response?.data?.message || "Hủy thất bại", "error");
      }
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
              <SearchIcon className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold mb-1">Tra Cứu Lịch Hẹn</h1>
            <p className="text-white/80 text-sm">Nhập số điện thoại để xem lịch hẹn của bạn</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại đã đặt lịch"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <SearchIcon className="w-5 h-5" />
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {searched && (
          <>
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-pulse text-gray-400">Đang tải...</div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Không tìm thấy lịch hẹn</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">Tìm thấy <span className="font-semibold text-blue-600">{appointments.length}</span> lịch hẹn</p>

                {appointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className={`px-5 py-3 border-b ${STATUS_COLORS[apt.status] || "bg-gray-100"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${STATUS_DOT[apt.status]}`}></div>
                          <span className="font-semibold">{apt.status}</span>
                        </div>
                        <span className="text-sm opacity-80">{formatDate(apt.date)} - {apt.time}</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400">Tên</p>
                            <p className="font-medium text-gray-800">{apt.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Bike className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400">Loại xe</p>
                            <p className="font-medium text-gray-800">{apt.vehicleType}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mb-4">
                        <Wrench className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Dịch vụ</p>
                          <div className="flex flex-wrap gap-1">
                            {apt.services.map((s, i) => (
                              <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {apt.note && (
                        <div className="bg-gray-50 rounded-xl p-3 mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Ghi chú: </span>
                            {apt.note}
                          </p>
                        </div>
                      )}

                      {apt.status !== "Hủy" && apt.status !== "Hoàn thành" && (
                        <div className="flex justify-end pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleCancel(apt)}
                            className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-all flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Hủy lịch hẹn
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
