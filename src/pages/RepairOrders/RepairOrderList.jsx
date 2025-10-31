import { useEffect, useState } from "react";
import { RepairOrderApi } from "../../services/RepairOrderApi";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  ClipboardList,
  Eye,
  Edit,
  Trash2,
  FolderMinus,
} from "lucide-react";
import Swal from "sweetalert2";

export default function RepairOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    RepairOrderApi.getAll()
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data || [];
        setOrders(arr);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  // Hàm chuyển trạng thái sang tiếng Việt
  const statusVN = {
    Pending: "Chờ xử lý",
    Processing: "Đang sửa",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };
  const getStatusVN = (status) => statusVN[status] || status;

  // Lọc danh sách theo email và ngày
  const filteredOrders = orders.filter((o) => {
    const email = o.customerId?.email?.toLowerCase() || "";
    const emailMatch = email.includes(searchEmail.toLowerCase());
    const dateStr = new Date(o.createdAt).toISOString().slice(0, 10);
    const dateMatch = searchDate ? dateStr === searchDate : true;
    return emailMatch && dateMatch;
  });
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc muốn xóa phiếu này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await RepairOrderApi.remove(id);
        Swal.fire("Đã xóa!", "Phiếu đã được xóa mềm thành công.", "success");
        setOrders(orders.filter((o) => o._id !== id));
      } catch (err) {
        console.error("Delete error:", err.response?.data || err.message);
        Swal.fire("Lỗi", "Không thể xóa phiếu!", "error");
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md max-w-6xl mx-auto mt-6">
      {/* Tiêu đề */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 text-blue-600">
          <ClipboardList className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-blue-800">
            Danh sách phiếu sửa chữa
          </h2>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-end">
          <button
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
            onClick={() => navigate("/repair-orders/add")}
          >
            <PlusCircle className="w-5 h-5" />
            Tạo phiếu mới
          </button>
          {/* ⚙️ Nút quản lý xóa mềm */}
          <button
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition"
            onClick={() => navigate("/repair-orders/deleted/list")}
          >
            <FolderMinus className="w-5 h-5" />
            Quản lý xóa mềm
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <input
            type="text"
            placeholder="Tìm theo email khách hàng..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-64"
          />
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
              <th className="px-4 py-3">Mã phiếu</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <tr
                  key={o._id}
                  className="hover:bg-gray-100 transition border-b last:border-none"
                >
                  <td className="px-4 py-3">{o.orderId}</td>
                  <td className="px-4 py-3">
                    {o.customerId?.fullName || "Khách lẻ"}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{getStatusVN(o.status)}</td>
                  <td className="px-4 py-3">
                    {o.totalAmount?.toLocaleString()}₫
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-4">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => navigate(`/repair-orders/${o._id}`)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => navigate(`/repair-orders/edit/${o._id}`)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(o._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Không có phiếu nào được tìm thấy.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
