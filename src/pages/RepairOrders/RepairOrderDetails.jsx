import React, { useEffect, useState } from "react";
import { getRepairOrderById } from "../../services/RepairOrderApi";
import { useParams, useNavigate } from "react-router-dom";

const RepairOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await getRepairOrderById(id);
            setOrder(res);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết phiếu:", error);
        }
    };

    if (!order) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-4">Chi tiết phiếu: {order.orderId}</h2>
            <p><strong>Khách hàng:</strong> {order.customerId?.fullName}</p>
            <p><strong>Nhân viên:</strong> {order.employeeId?.fullName}</p>
            <p><strong>Tổng tiền:</strong> {order.totalAmount}</p>
            <p><strong>Trạng thái:</strong> {order.status}</p>
            <p><strong>Ghi chú:</strong> {order.notes}</p>
            <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>

            <h3 className="mt-4 text-lg font-semibold">Danh sách sản phẩm / dịch vụ</h3>
            <table className="w-full border-collapse border mt-2">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-3 py-2">Tên</th>
                        <th className="border px-3 py-2">Số lượng</th>
                        <th className="border px-3 py-2">Giá</th>
                        <th className="border px-3 py-2">Tạm tính</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, idx) => (
                        <tr key={idx}>
                            <td className="border px-3 py-2">{item.name}</td>
                            <td className="border px-3 py-2">{item.quantity}</td>
                            <td className="border px-3 py-2">{item.price}</td>
                            <td className="border px-3 py-2">{item.subtotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                className="mt-4 bg-gray-200 px-4 py-2 rounded"
                onClick={() => navigate("/repair-orders")}
            >
                Quay lại
            </button>
        </div>
    );
};

export default RepairOrderDetails;
