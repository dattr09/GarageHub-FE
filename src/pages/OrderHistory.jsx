import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "../services/OrderApi";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

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
            const sortedOrders = response.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử mua hàng:", error);
            alert("Không thể lấy lịch sử mua hàng!");
        }
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedOrder(null);
    };

    return (
        <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Lịch sử mua hàng</h2>
            {orders.length === 0 ? (
                <p className="text-center text-gray-500 italic">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="text-blue-700 font-semibold border-b">
                            <th className="py-2 text-left">Mã đơn hàng</th>
                            <th className="text-left">Ngày đặt hàng</th>
                            <th className="text-right">Tổng tiền</th>
                            <th className="text-center">Số sản phẩm</th>
                            <th className="text-center">Trạng thái</th>
                            <th className="text-center">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order._id}
                                className="border-b hover:bg-gray-50 transition cursor-pointer"
                            >
                                <td className="py-2">{order.orderId}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="text-right">{order.totalAmount.toLocaleString()} đ</td>
                                <td className="text-center">{order.items.length}</td>
                                <td className="text-center">{order.status}</td>
                                <td className="text-center">
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => handleOrderClick(order)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Popup chi tiết đơn hàng */}
            {showPopup && selectedOrder && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={closePopup}
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">
                            Mã đơn hàng: {selectedOrder.orderId}
                        </h3>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-600">
                                Ngày đặt hàng: <span className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                            </p>
                            <p className="text-gray-600">
                                Giờ đặt hàng: <span className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleTimeString()}</span>
                            </p>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-600">
                                Trạng thái: <span className="font-semibold">{selectedOrder.status}</span>
                            </p>
                            <p className="text-gray-600">
                                Tổng tiền: <span className="font-bold text-lg">{selectedOrder.totalAmount.toLocaleString()} đ</span>
                            </p>
                        </div>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="text-blue-700 font-semibold border-b">
                                    <th className="py-2 text-left">Tên sản phẩm</th>
                                    <th className="text-center">Hãng</th>
                                    <th className="text-center">Số lượng</th>
                                    <th className="text-right">Giá</th>
                                    <th className="text-right">Tạm tính</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items.map((item) => (
                                    <tr
                                        key={item.partId?._id || item._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="py-2">{item.partId?.name || "Không xác định"}</td>
                                        <td className="text-center">{item.partId?.brandId?.name || "Không xác định"}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-right">{item.partId?.price?.toLocaleString() || "0"} đ</td>
                                        <td className="text-right">
                                            {(item.partId?.price * item.quantity)?.toLocaleString() || "0"} đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}