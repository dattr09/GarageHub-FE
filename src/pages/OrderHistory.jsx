import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "../services/OrderApi";
import { Package, Calendar, Eye, X, ShoppingBag, DollarSign, MapPin, FileText, CreditCard } from "lucide-react";

const STATUS_CONFIG = {
    Pending: { label: "Chờ xử lý", color: "bg-amber-100 text-amber-700 border-amber-200" },
    Processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-700 border-blue-200" },
    Shipped: { label: "Đang giao", color: "bg-purple-100 text-purple-700 border-purple-200" },
    Delivered: { label: "Đã giao", color: "bg-green-100 text-green-700 border-green-200" },
    Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700 border-red-200" },
};

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Bạn cần đăng nhập để xem lịch sử mua hàng!");
            return;
        }
        fetchOrderHistory(userId);
    }, []);

    const fetchOrderHistory = async (userId) => {
        try {
            const response = await getOrdersByUser(userId);
            const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử mua hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (val) => new Intl.NumberFormat("vi-VN").format(val);
    const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    const getStatus = (status) => STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-700" };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <Package className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Lịch Sử Mua Hàng</h1>
                        <p className="text-white/80 text-sm">{orders.length} đơn hàng</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-4 pb-8">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                        <div className="animate-pulse text-gray-400">Đang tải...</div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                        <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng</h3>
                        <p className="text-gray-400">Bạn chưa có đơn hàng nào</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const status = getStatus(order.status);
                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-wrap gap-4 items-center justify-between">
                                        {/* Order Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                                <ShoppingBag className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">#{order.orderId}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status + Items */}
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-400">Sản phẩm</p>
                                                <p className="font-semibold text-gray-800">{order.items.length}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-400">Tổng tiền</p>
                                                <p className="font-bold text-blue-600">{formatPrice(order.totalAmount)} ₫</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* Action */}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Chi tiết
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold">Đơn hàng #{selectedOrder.orderId}</h3>
                                    <p className="text-white/80 text-sm">{formatDate(selectedOrder.createdAt)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatus(selectedOrder.status).color}`}>
                                    {getStatus(selectedOrder.status).label}
                                </span>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-500" />
                                    <span className="text-xl font-bold text-gray-800">{formatPrice(selectedOrder.totalAmount)} ₫</span>
                                </div>
                            </div>

                            {/* Thông tin giao hàng */}
                            {selectedOrder.shippingAddress && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        Địa chỉ giao hàng
                                    </h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>{selectedOrder.shippingAddress.street}</p>
                                        <p>
                                            {[selectedOrder.shippingAddress.city, selectedOrder.shippingAddress.state, selectedOrder.shippingAddress.zipCode]
                                                .filter(Boolean).join(", ")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Ghi chú */}
                            {selectedOrder.notes && (
                                <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-amber-500" />
                                        Ghi chú
                                    </h4>
                                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {/* Phương thức thanh toán */}
                            {selectedOrder.paymentMethod && (
                                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-green-500" />
                                        Phương thức thanh toán
                                    </h4>
                                    <p className="text-sm text-gray-600">{selectedOrder.paymentMethod}</p>
                                </div>
                            )}

                            <h4 className="font-semibold text-gray-800 mb-3">Sản phẩm</h4>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.partId?._id || item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{item.partId?.name || item.name || "Sản phẩm"}</p>
                                            <p className="text-sm text-gray-500">{item.partId?.brandId?.name || ""}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">x{item.quantity}</p>
                                            <p className="font-semibold text-blue-600">{formatPrice((item.partId?.price || item.price || 0) * item.quantity)} ₫</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}