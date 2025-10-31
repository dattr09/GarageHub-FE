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
        // ✅ Tự động xử lý cả 3 trường hợp (res.data.data, res.data, hoặc res)
        const order = res.data?.data || res.data || res;
        setOrder(order);
        console.log("✅ Chi tiết phiếu sửa chữa:", order);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy chi tiết phiếu:", err);
        setOrder(null);
      });
  }, [id]);

  if (!order)
    return (
      <div className="max-w-xl mx-auto mt-8 text-center text-red-500">
        {" "}
        Không tìm thấy phiếu sửa chữa.{" "}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* Tiêu đề */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <ClipboardList className="w-9 h-9 text-green-600" />
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Chi tiết phiếu sửa chữa
        </h2>
      </div>

      {/* Thông tin chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột trái */}
        <div className="space-y-5">
          <InfoRow
            icon={<ListOrdered className="w-6 h-6 text-blue-500" />}
            label="Mã phiếu"
            value={order.orderId}
          />
          <InfoRow
            icon={<UserRound className="w-6 h-6 text-indigo-500" />}
            label="Khách hàng"
            value={order.customerId?.fullName || order.customerId?.email}
          />
          <InfoRow
            icon={<UserCog className="w-6 h-6 text-orange-500" />}
            label="Nhân viên"
            value={order.employeeId?.fullName || order.employeeId?.email}
          />
          <InfoRow
            icon={<CalendarDays className="w-6 h-6 text-gray-500" />}
            label="Ngày tạo"
            value={new Date(order.createdAt).toLocaleString()}
          />
          <InfoRow
            icon={<BadgeCheck className="w-6 h-6 text-green-500" />}
            label="Trạng thái"
            value={statusVN[order.status] || order.status}
            valueClass={
              order.status === "Completed"
                ? "text-green-700 font-bold"
                : order.status === "Cancelled"
                ? "text-red-600 font-bold"
                : "text-yellow-600 font-bold"
            }
          />
        </div>

        {/* Cột phải */}
        <div className="space-y-5">
          <InfoRow
            icon={<CreditCard className="w-6 h-6 text-purple-500" />}
            label="Thanh toán"
            value={order.paymentMethod}
          />
          <InfoRow
            icon={<BadgeDollarSign className="w-6 h-6 text-green-600" />}
            label="Chi phí sửa chữa"
            value={`${order.repairCosts?.toLocaleString()}₫`}
          />
          <InfoRow
            icon={<Wrench className="w-6 h-6 text-orange-600" />}
            label="Tổng tiền"
            value={`${order.totalAmount?.toLocaleString()}₫`}
            valueClass="text-blue-700 font-bold text-lg"
          />
          <InfoRow
            icon={<StickyNote className="w-6 h-6 text-gray-400" />}
            label="Ghi chú"
            value={order.notes || "Không có"}
          />
          <InfoRow
            icon={<FileText className="w-6 h-6 text-gray-500" />}
            label="Ngày cập nhật"
            value={
              order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "—"
            }
          />
        </div>
      </div>

      {/* Danh sách phụ tùng */}
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
              {order.items?.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-3 py-2 border">{idx + 1}</td>
                  <td className="px-3 py-2 border">
                    {item.partId?.name || item.name || "--"}
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

      {/* Nút quay lại */}
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

// 🔹 Component phụ: hiển thị dòng thông tin
function InfoRow({ icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className={`text-gray-900 ${valueClass}`}>{value || "—"}</span>
    </div>
  );
}
