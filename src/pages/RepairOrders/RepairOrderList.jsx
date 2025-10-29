import React, { useEffect, useState } from "react";
import { getAllRepairOrders, deleteRepairOrder } from "../../services/RepairOrderApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, Edit, Trash2, PlusCircle, ClipboardList } from "lucide-react";

const RepairOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getAllRepairOrders();
            setOrders(Array.isArray(res) ? res : res.orders || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu:", error);
            Swal.fire({
                title: "Lỗi!",
                text: "Không thể tải danh sách phiếu sửa chữa.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc muốn xóa phiếu này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteRepairOrder(id);
                    Swal.fire("Đã xóa!", "Phiếu đã được xóa thành công.", "success");
                    fetchOrders();
                } catch (error) {
                    Swal.fire("Lỗi!", "Xóa phiếu thất bại.", "error");
                }
            }
        });
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md max-w-6xl mx-auto mt-6">
            {/* Tiêu đề */}
            <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2 text-green-600">
                    <ClipboardList className="w-8 h-8" />
                    <h2 className="text-3xl font-bold text-gray-800">Danh sách phiếu sửa chữa</h2>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                    Quản lý tất cả phiếu sửa chữa của khách hàng tại đây
                </p>
            </div>

            {/* Nút thêm phiếu */}
            <div className="flex justify-end mb-4">
                <button
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                    onClick={() => navigate("/repair-orders/add")}
                >
                    <PlusCircle className="w-5 h-5" />
                    Thêm phiếu
                </button>
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
                            <th className="px-4 py-3">Nhân viên</th>
                            <th className="px-4 py-3 text-right">Tổng tiền</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((o) => (
                                <tr
                                    key={o._id}
                                    className="hover:bg-gray-100 transition border-b last:border-none"
                                >
                                    <td className="px-4 py-3">{o.orderId}</td>
                                    <td className="px-4 py-3">{o.customerId?.fullName || "—"}</td>
                                    <td className="px-4 py-3">{o.employeeId?.fullName || "—"}</td>
                                    <td className="px-4 py-3 text-right">
                                        {o.totalAmount?.toLocaleString()} đ
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${o.status === "Completed"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                                }`}
                                        >
                                            {o.status}
                                        </span>
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
                                    Chưa có phiếu nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RepairOrderList;
