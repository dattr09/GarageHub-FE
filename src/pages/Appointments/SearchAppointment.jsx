import { useState } from "react";
import { Search as SearchIcon, Phone, Calendar, Clock, X, AlertCircle } from "lucide-react";
import { AppointmentApi } from "../../services/AppointmentApi";
import Swal from "sweetalert2";

const STATUS_COLORS = {
  "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
  "Đã xác nhận": "bg-blue-100 text-blue-800",
  "Đang sửa": "bg-orange-100 text-orange-800",
  "Hoàn thành": "bg-green-100 text-green-800",
  "Hủy": "bg-red-100 text-red-800",
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
        Swal.fire("Thông báo", "Không tìm thấy lịch hẹn nào với số điện thoại này", "info");
      }
    } catch (error) {
      console.error("Error searching appointments:", error);
      Swal.fire("Lỗi", "Không thể tìm kiếm lịch hẹn", "error");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointment) => {
    if (appointment.status === "Hoàn thành") {
      Swal.fire("Lỗi", "Không thể hủy lịch hẹn đã hoàn thành", "error");
      return;
    }

    if (appointment.status === "Hủy") {
      Swal.fire("Thông báo", "Lịch hẹn này đã được hủy", "info");
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận hủy lịch hẹn?",
      text: `Bạn có chắc chắn muốn hủy lịch hẹn ngày ${formatDate(appointment.date)} lúc ${appointment.time}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy lịch",
      cancelButtonText: "Không",
    });

    if (result.isConfirmed) {
      try {
        await AppointmentApi.cancel(appointment._id, phone);
        Swal.fire("Thành công", "Hủy lịch hẹn thành công", "success");
        handleSearch(); // Tải lại danh sách
      } catch (error) {
        Swal.fire("Lỗi", error.response?.data?.message || "Hủy lịch hẹn thất bại", "error");
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 rounded-lg shadow-md bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 text-blue-600">
          <SearchIcon className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-blue-800">Tìm kiếm lịch hẹn</h2>
        </div>
        <p className="text-gray-600">Nhập số điện thoại để xem và quản lý lịch hẹn của bạn</p>
      </div>

      {/* Form tìm kiếm */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <label className="font-semibold text-gray-700">Số điện thoại</label>
        </div>
        <div className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại đã đặt lịch"
            className="flex-1 border rounded px-4 py-2 focus:ring-2 focus:ring-blue-200"
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-lg disabled:opacity-50 transition"
          >
            <SearchIcon className="w-5 h-5" />
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </div>

      {/* Danh sách lịch hẹn */}
      {searched && (
        <div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Không tìm thấy lịch hẹn nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{apt.customerName}</h3>
                      <p className="text-gray-600 flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4" />
                        {apt.phone}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${STATUS_COLORS[apt.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Ngày: {formatDate(apt.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Giờ: {apt.time}</span>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Loại xe: </span>
                      {apt.vehicleType}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Dịch vụ: </span>
                      {apt.services.join(", ")}
                    </div>
                  </div>

                  {apt.note && (
                    <div className="bg-gray-50 rounded p-2 mb-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ghi chú: </span>
                        {apt.note}
                      </p>
                    </div>
                  )}

                  {apt.status !== "Hủy" && apt.status !== "Hoàn thành" && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCancel(apt)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Hủy lịch hẹn
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

