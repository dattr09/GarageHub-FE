import React, { useEffect, useState } from "react";
import { Undo2, Trash2, Wrench } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";
import {
  RepairOrderApi,
  getDeletedRepairOrders,
  deleteRepairOrderPermanently,
  restoreRepairOrder,
} from "../../services/repairOrderApi";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}
`;

const DeleteRepairOrderList = () => {
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDeletedOrders = async () => {
    setLoading(true);
    try {
      const data = await getDeletedRepairOrders();
      // data có thể là { message, deletedRepairOrders }
      setDeletedOrders(data?.deletedRepairOrders || []);
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể tải danh sách phiếu đã xóa.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedOrders();
  }, []);

  // Khôi phục phiếu
  // Khôi phục phiếu
  const handleRestore = async (id) => {
    const confirm = await Swal.fire({
      title: "Khôi phục phiếu?",
      text: "Bạn có chắc muốn khôi phục phiếu sửa chữa này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Khôi phục",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await restoreRepairOrder(id); // <-- gọi hàm restore mới
        await fetchDeletedOrders(); // refresh danh sách
        Swal.fire("Thành công!", "Phiếu đã được khôi phục.", "success");
      } catch {
        Swal.fire("Lỗi!", "Không thể khôi phục phiếu.", "error");
      }
    }
  };

  // Xóa vĩnh viễn phiếu
  const handlePermanentDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Xóa vĩnh viễn?",
      text: "Thao tác này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa luôn",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteRepairOrderPermanently(id);
        setDeletedOrders((prev) => prev.filter((o) => o._id !== id));
        Swal.fire("Đã xóa!", "Phiếu sửa chữa đã bị xóa vĩnh viễn.", "success");
      } catch {
        Swal.fire("Lỗi!", "Không thể xóa phiếu.", "error");
      }
    }
  };

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-6xl animate-fade-in">
          {/* Header */}
          <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <Wrench className="text-red-600 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 text-center">
              Danh sách phiếu sửa chữa đã xóa
            </h3>
          </div>

          {/* Table */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {loading ? (
              <p className="text-center text-gray-500">Đang tải...</p>
            ) : deletedOrders.length === 0 ? (
              <p className="text-center text-gray-500">
                Không có phiếu sửa chữa nào bị xóa.
              </p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 border">Mã phiếu</th>
                    <th className="px-4 py-2 border">Khách hàng</th>
                    <th className="px-4 py-2 border">Nhân viên</th>
                    <th className="px-4 py-2 border">Biển số xe</th>
                    <th className="px-4 py-2 border text-center">Tổng tiền</th>
                    <th className="px-4 py-2 border">Ngày xóa</th>
                    <th className="px-4 py-2 border text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 border font-medium">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {order.customerId?.fullName || "N/A"}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {order.employeeId?.fullName || "N/A"}
                      </td>
                      <td className="px-4 py-2 border text-gray-600">
                        {order.items?.map((i) => i.licensePlate).join(", ") ||
                          "--"}
                      </td>
                      <td className="px-4 py-2 border text-center text-green-600 font-semibold">
                        {order.totalAmount
                          ? order.totalAmount.toLocaleString("vi-VN") + " ₫"
                          : "--"}
                      </td>
                      <td className="px-4 py-2 border text-gray-600">
                        {order.deletedAt
                          ? new Date(order.deletedAt).toLocaleString("vi-VN")
                          : "--"}
                      </td>
                      <td className="px-4 py-2 border text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleRestore(order._id)}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                          <Undo2 className="w-4 h-4" /> Khôi phục
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(order._id)}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-center items-center py-4 border-t border-gray-100">
            <button
              onClick={() => navigate("/repair-orders")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteRepairOrderList;
