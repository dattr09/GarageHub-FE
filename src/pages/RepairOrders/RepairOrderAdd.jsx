import React, { useState, useEffect } from "react";
import { AuthAPI } from "../../services/api";
import { getAllParts } from "../../services/PartsApi";
import { createRepairOrder } from "../../services/RepairOrderApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ClipboardList, PlusCircle, Trash2 } from "lucide-react";

const RepairOrderAdd = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [parts, setParts] = useState([]);
    const [formData, setFormData] = useState({
        customerId: "",
        items: [],
        repairCosts: 0,
        notes: "",
        paymentMethod: "",
        status: "Pending", // Trạng thái mặc định
        createdAt: new Date().toISOString(), // Ngày tạo
        updatedAt: new Date().toISOString(), // Ngày cập nhật
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCustomers();
        fetchParts();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await AuthAPI.getAllUsers();
            if (Array.isArray(res)) {
                setCustomers(res);
            } else {
                console.error("API không trả về danh sách khách hàng hợp lệ:", res);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
            Swal.fire("Lỗi!", "Không thể tải danh sách khách hàng.", "error");
        }
    };

    const fetchParts = async () => {
        try {
            const res = await getAllParts();
            setParts(res);
        } catch (error) {
            console.error("Lỗi fetch phụ tùng:", error);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { partId: "", quantity: 1 }],
        });
    };

    const removeItem = (index) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createRepairOrder(formData);
            Swal.fire("Thành công!", "Phiếu sửa chữa đã được tạo.", "success").then(() =>
                navigate("/repair-orders")
            );
        } catch (error) {
            Swal.fire(
                "Lỗi!",
                error.response?.data?.message || "Tạo phiếu thất bại",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalCost = () => {
        return formData.items.reduce((total, item) => {
            const part = parts.find((p) => p._id === item.partId);
            return total + (part ? part.price * item.quantity : 0);
        }, 0);
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md max-w-4xl mx-auto mt-6">
            {/* Tiêu đề */}
            <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2 text-green-600">
                    <ClipboardList className="w-8 h-8" />
                    <h2 className="text-3xl font-bold text-gray-800">Tạo phiếu sửa chữa</h2>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                    Điền thông tin chi tiết để tạo phiếu sửa chữa mới
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Khách hàng */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khách hàng:
                    </label>
                    <select
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={formData.customerId}
                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        required
                    >
                        <option value="">Chọn khách hàng</option>
                        {customers.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Phụ tùng / Dịch vụ */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phụ tùng / Dịch vụ:
                    </label>
                    {formData.items.map((item, idx) => {
                        const selectedPart = parts.find((p) => p._id === item.partId);
                        return (
                            <div key={idx} className="flex flex-col gap-2 mb-4">
                                <div className="flex gap-2 items-center">
                                    {/* Dropdown chọn phụ tùng */}
                                    <select
                                        className="border px-2 py-1 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={item.partId}
                                        onChange={(e) => handleItemChange(idx, "partId", e.target.value)}
                                        required
                                    >
                                        <option value="">Chọn phụ tùng</option>
                                        {parts.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Nhập số lượng */}
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleItemChange(idx, "quantity", Number(e.target.value))
                                        }
                                        className="w-20 border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />

                                    {/* Nút xóa */}
                                    <button
                                        type="button"
                                        onClick={() => removeItem(idx)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Hiển thị thông tin hãng và giá */}
                                {selectedPart && (
                                    <div className="text-sm text-gray-600 pl-2">
                                        <p>
                                            Hãng:{" "}
                                            <span className="font-medium">{selectedPart.brand}</span>
                                        </p>
                                        <p>
                                            Giá:{" "}
                                            <span className="font-medium">
                                                {selectedPart.price.toLocaleString()} đ
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mt-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Thêm phụ tùng
                    </button>
                </div>

                {/* Chi phí sửa chữa */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chi phí sửa chữa:
                    </label>
                    <input
                        type="number"
                        value={formData.repairCosts}
                        onChange={(e) =>
                            setFormData({ ...formData, repairCosts: Number(e.target.value) })
                        }
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                {/* Ghi chú */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú:</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    ></textarea>
                </div>

                {/* Phương thức thanh toán */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phương thức thanh toán:
                    </label>
                    <input
                        type="text"
                        value={formData.paymentMethod}
                        onChange={(e) =>
                            setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                {/* Trạng thái */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái:</label>
                    <select
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="Pending">Chờ xử lý</option>
                        <option value="In Progress">Đang xử lý</option>
                        <option value="Completed">Hoàn thành</option>
                    </select>
                </div>

                {/* Tổng chi phí */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tổng chi phí:
                    </label>
                    <div className="text-lg font-bold text-green-600">
                        {calculateTotalCost().toLocaleString()} đ
                    </div>
                </div>

                {/* Nút tạo phiếu */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow transition"
                >
                    {loading ? "Đang lưu..." : "Tạo phiếu"}
                </button>
            </form>
        </div>
    );
};

export default RepairOrderAdd;
