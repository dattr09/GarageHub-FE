import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RepairOrderApi } from "../../services/RepairOrderApi";
import {
  ClipboardList,
  UserRound,
  BadgeDollarSign,
  FileText,
  Wrench,
  CalendarDays,
  UserCog,
  CreditCard,
  ListOrdered,
  ArrowLeft,
  BadgeCheck,
  StickyNote,
} from "lucide-react";

const statusVN = {
  Pending: "Chờ xử lý",
  Processing: "Đang sửa",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
};

export default function RepairOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    RepairOrderApi.getById(id)
      .then((res) => {
        // Nếu backend trả về { data: {...} } thì dùng res.data.data, còn nếu trả object trực tiếp thì dùng res.data
        setOrder(res.data.data || res.data);
        console.log("Chi tiết phiếu sửa chữa:", res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết phiếu:", err);
        setOrder(null);
      });
  }, [id]);

  if (!order)
    return (
      <div className="max-w-xl mx-auto mt-8 text-center text-red-500">
        Không tìm thấy phiếu sửa chữa.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* Tiêu đề căn giữa */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <ClipboardList className="w-9 h-9 text-green-600" />
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Chi tiết phiếu sửa chữa
        </h2>
      </div>
      {/* 2 cột, mỗi bên 5 trường */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột trái */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <ListOrdered className="w-6 h-6 text-blue-500" />
            <span className="font-semibold text-gray-700">Mã phiếu:</span>
            <span className="text-gray-900">{order.orderId}</span>
          </div>
          <div className="flex items-center gap-3">
            <UserRound className="w-6 h-6 text-indigo-500" />
            <span className="font-semibold text-gray-700">Khách hàng:</span>
            <span className="text-gray-900">
              {order.customerId?.fullName || order.customerId?.email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <UserCog className="w-6 h-6 text-orange-500" />
            <span className="font-semibold text-gray-700">Nhân viên:</span>
            <span className="text-gray-900">
              {order.employeeId?.fullName || order.employeeId?.email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-gray-500" />
            <span className="font-semibold text-gray-700">Ngày tạo:</span>
            <span className="text-gray-900">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-6 h-6 text-green-500" />
            <span className="font-semibold text-gray-700">Trạng thái:</span>
            <span
              className={`font-bold ${
                order.status === "Completed"
                  ? "text-green-700"
                  : order.status === "Cancelled"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {statusVN[order.status] || order.status}
            </span>
          </div>
        </div>
        {/* Cột phải */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-purple-500" />
            <span className="font-semibold text-gray-700">Thanh toán:</span>
            <span className="text-gray-900">{order.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-3">
            <BadgeDollarSign className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-gray-700">
              Chi phí sửa chữa:
            </span>
            <span className="text-gray-900">
              {order.repairCosts?.toLocaleString()}₫
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6 text-orange-600" />
            <span className="font-semibold text-gray-700">Tổng tiền:</span>
            <span className="text-blue-700 font-bold text-lg">
              {order.totalAmount?.toLocaleString()}₫
            </span>
          </div>
          <div className="flex items-center gap-3">
            <StickyNote className="w-6 h-6 text-gray-400" />
            <span className="font-semibold text-gray-700">Ghi chú:</span>
            <span className="text-gray-900">
              {order.notes || (
                <span className="italic text-gray-400">Không có</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-gray-500" />
            <span className="font-semibold text-gray-700">Ngày cập nhật:</span>
            <span className="text-gray-900">
              {order.updatedAt
                ? new Date(order.updatedAt).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
      </div>
      {/* Danh sách phụ tùng nằm cuối */}
      <div className="mt-10">
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-orange-600" />
            <span className="font-semibold text-blue-700 text-lg">
              Danh sách phụ tùng
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 border rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-3 py-2 border">STT</th>
                <th className="px-3 py-2 border">Tên</th>
                <th className="px-3 py-2 border">Hãng</th>
                <th className="px-3 py-2 border">Số lượng</th>
                <th className="px-3 py-2 border">Đơn giá</th>
                <th className="px-3 py-2 border">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-3 py-2 border">{idx + 1}</td>
                  <td className="px-3 py-2 border">
                    {item.name || item.partId?.name || "--"}
                  </td>
                  <td className="px-3 py-2 border">
                    {item.partId?.brandId?.name || "--"}
                  </td>
                  <td className="px-3 py-2 border">{item.quantity}</td>
                  <td className="px-3 py-2 border">
                    {item.price?.toLocaleString()}₫
                  </td>
                  <td className="px-3 py-2 border text-green-700 font-semibold">
                    {(item.price * item.quantity)?.toLocaleString()}₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Nút quay lại căn giữa */}
      <div className="flex justify-center mt-8">
        <button
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow"
          onClick={() => navigate("/repair-orders")}
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>
      </div>
    </div>
  );
}
