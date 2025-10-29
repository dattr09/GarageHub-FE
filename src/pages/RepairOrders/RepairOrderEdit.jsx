import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRepairOrderById, updateRepairOrder } from "../../services/RepairOrderApi";
import { getAllParts } from "../../services/PartsApi";
import Swal from "sweetalert2";

const RepairOrderEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        items: [],
        repairCosts: 0,
        notes: "",
        paymentMethod: "",
    });
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrder();
        fetchParts();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await getRepairOrderById(id);
            setFormData({
                items: res.items.map(i => ({ partId: i.partId?._id || i.partId, quantity: i.quantity })),
                repairCosts: res.repairCosts,
                notes: res.notes,
                paymentMethod: res.paymentMethod,
            });
        } catch (error) {
            console.error("Lỗi fetch phiếu:", error);
        }
    };

    const fetchParts = async () => {
        try {
            const res = await getAllParts();
            setParts(res);
        } catch (error) {
            console.error("Lỗi fetch parts:", error);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({ ...formData, items: [...formData.items, { partId: "", quantity: 1 }] });
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
            await updateRepairOrder(id, formData);
            Swal.fire("Thành công!", "Phiếu đã được cập nhật.", "success").then(() =>
                navigate("/repair-orders")
            );
        } catch (error) {
            Swal.fire("Lỗi!", "Cập nhật phiếu thất bại", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa phiếu sửa chữa</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label>Phụ tùng / Dịch vụ:</label>
                    {formData.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 mb-2 items-center">
                            <select
                                value={item.partId}
                                onChange={(e) => handleItemChange(idx, "partId", e.target.value)}
                                className="border px-2 py-1 flex-1 rounded"
                                required
                            >
                                <option value="">Chọn phụ tùng</option>
                                {parts.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                                className="w-20 border px-2 py-1 rounded"
                            />
                            <button type="button" className="text-red-500" onClick={() => removeItem(idx)}>Xóa</button>
                        </div>
                    ))}
                    <button type="button" className="text-blue-500 mt-1" onClick={addItem}>+ Thêm phụ tùng</button>
                </div>

                <div className="mb-4">
                    <label>Chi phí sửa chữa:</label>
                    <input
                        type="number"
                        value={formData.repairCosts}
                        onChange={(e) => setFormData({ ...formData, repairCosts: Number(e.target.value) })}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label>Ghi chú:</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label>Phương thức thanh toán:</label>
                    <input
                        type="text"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
                >
                    {loading ? "Đang lưu..." : "Cập nhật phiếu"}
                </button>
            </form>
        </div>
    );
};

export default RepairOrderEdit;
