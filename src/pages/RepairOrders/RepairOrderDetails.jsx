import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RepairOrderApi } from "../../services/RepairOrderApi";
import {
    ClipboardList, User, DollarSign, FileText, Wrench,
    Calendar, UserCog, CreditCard, ArrowLeft, Edit2, Package
} from "lucide-react";

const STATUS_CONFIG = {
    Pending: { label: "Chờ xử lý", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
    Processing: { label: "Đang sửa", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    Completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
    Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

export default function RepairOrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        RepairOrderApi.getById(id)
            .then(res => setOrder(res.data.data))
            .catch(() => setOrder(null))
            .finally(() => setLoading(false));
    }, [id]);

    const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price || 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Đang tải...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Không tìm thấy phiếu sửa chữa</p>
                </div>
            </div>
        );
    }

    const status = STATUS_CONFIG[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700", dot: "bg-gray-500" };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/repair-orders")}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại</span>
                    </button>
                    <button
                        onClick={() => navigate(`/repair-orders/edit/${id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Order Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Mã phiếu</p>
                                <h1 className="text-3xl font-bold">#{order.orderId}</h1>
                            </div>
                            <div className={`px-4 py-2 rounded-full ${status.color} font-semibold flex items-center gap-2`}>
                                <div className={`w-2 h-2 rounded-full ${status.dot}`}></div>
                                {status.label}
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs text-gray-500">Khách hàng</span>
                                </div>
                                <p className="font-semibold text-gray-800 truncate">{order.customerId?.fullName || order.customerId?.email}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserCog className="w-4 h-4 text-orange-500" />
                                    <span className="text-xs text-gray-500">Nhân viên</span>
                                </div>
                                <p className="font-semibold text-gray-800 truncate">{order.employeeId?.fullName || order.employeeId?.email}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500">Ngày tạo</span>
                                </div>
                                <p className="font-semibold text-gray-800">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="w-4 h-4 text-purple-500" />
                                    <span className="text-xs text-gray-500">Thanh toán</span>
                                </div>
                                <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Parts Table */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-500" />
                        Danh sách phụ tùng
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">STT</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tên phụ tùng</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Hãng</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">SL</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Đơn giá</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-gray-600">{idx + 1}</td>
                                        <td className="py-3 px-4 font-medium text-gray-800">{item.name || item.partId?.name || "—"}</td>
                                        <td className="py-3 px-4 text-gray-600">{item.partId?.brandId?.name || "—"}</td>
                                        <td className="py-3 px-4 text-center text-gray-800">{item.quantity}</td>
                                        <td className="py-3 px-4 text-right text-gray-600">{formatPrice(item.price)}₫</td>
                                        <td className="py-3 px-4 text-right font-semibold text-blue-600">{formatPrice(item.price * item.quantity)}₫</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Notes */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Ghi chú
                            </h3>
                            <p className="text-gray-800 bg-gray-50 rounded-xl p-4">{order.notes || <span className="text-gray-400 italic">Không có ghi chú</span>}</p>
                        </div>

                        {/* Totals */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tiền phụ tùng</span>
                                    <span className="font-medium text-gray-800">{formatPrice(order.totalAmount - (order.repairCosts || 0))}₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Chi phí sửa chữa</span>
                                    <span className="font-medium text-gray-800">{formatPrice(order.repairCosts)}₫</span>
                                </div>
                                <div className="border-t border-blue-200 pt-3 flex justify-between">
                                    <span className="font-semibold text-gray-800">Tổng cộng</span>
                                    <span className="text-2xl font-bold text-blue-600">{formatPrice(order.totalAmount)}₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}